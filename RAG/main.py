import os
import json
from langchain_huggingface import HuggingFaceEmbeddings
from langchain.vectorstores import FAISS
from langchain_community.llms.huggingface_pipeline import HuggingFacePipeline
from langchain.chains import RetrievalQA
from langchain.prompts import PromptTemplate
from transformers import AutoTokenizer, AutoModelForCausalLM, pipeline

PROJECT_PATH = "./backend"
INDEX_PATH = "code_index"
MODEL_NAME = "bigcode/starcoder2-7b"
EMBEDDING_MODEL = "sentence-transformers/all-MiniLM-L6-v2"

def load_project_files(directory, file_types=(".ts", ".json")):
    documents = []
    for root, _, files in os.walk(directory):
        for file in files:
            if file.endswith(file_types):
                file_path = os.path.join(root, file)
                try:
                    with open(file_path, "r", encoding="utf-8") as f:
                        content = f.read()
                    if content.strip():
                        documents.append({
                            "text": content,
                            "metadata": {"path": file_path, "type": os.path.splitext(file)[1]}
                        })
                except Exception as e:
                    print(f"Erro ao carregar arquivo {file_path}: {e}")
    return documents

def create_or_load_index(documents, index_path):
    embeddings = HuggingFaceEmbeddings(model_name=EMBEDDING_MODEL)

    if os.path.exists(f"{index_path}.faiss"):
        print("Carregando índice existente...")
        return FAISS.load_local(index_path, embeddings, allow_dangerous_deserialization=True)

    print("Criando novo índice...")
    if not documents:
        raise ValueError("Nenhum documento foi encontrado no projeto.")
    
    valid_documents = [doc for doc in documents if doc["text"].strip()]
    if not valid_documents:
        raise ValueError("Nenhum documento válido foi encontrado para indexar.")
    
    vector_store = FAISS.from_texts(
        [doc["text"] for doc in valid_documents],
        embeddings,
        metadatas=[doc["metadata"] for doc in valid_documents]
    )
    vector_store.save_local(index_path)
    return vector_store

def load_llama_model(model_name):
    tokenizer = AutoTokenizer.from_pretrained(model_name)
    model = AutoModelForCausalLM.from_pretrained(model_name)
    qa_pipeline = pipeline(
        "text-generation",
        model=model,
        tokenizer=tokenizer,
        max_new_tokens=256,
        truncation=True,
        pad_token_id=tokenizer.eos_token_id
    )
    return HuggingFacePipeline(pipeline=qa_pipeline)

def run_rag(query, retriever, llama_model):
    prompt_template = PromptTemplate(
        input_variables=["context", "question"],
        template="""Você é um assistente de programação que responde perguntas sobre código-fonte.\n\n
        Contexto: {context}\n
        Pergunta: {question}\n
        Resposta:
        """
    )
    qa_chain = RetrievalQA.from_chain_type(
        retriever=retriever,
        llm=llama_model,
        return_source_documents=True,
        chain_type_kwargs={"prompt": prompt_template}
    )
    output = qa_chain.invoke({"query": query})
    return output

if __name__ == "__main__":
    print("Carregando arquivos do projeto...")
    docs = load_project_files(PROJECT_PATH)

    print("Configurando índice de documentos...")
    try:
        vector_store = create_or_load_index(docs, INDEX_PATH)
    except Exception as e:
        print(f"Erro ao configurar o índice: {e}")
        exit(1)

    print("Carregando modelo Llama...")
    llama_model = load_llama_model(MODEL_NAME)

    retriever = vector_store.as_retriever(search_kwargs={"k": 3})

    question = "Como a API de autenticação é implementada?"
    print(f"Executando RAG para a pergunta: {question}\n")

    try:
        output = run_rag(question, retriever, llama_model)
        result = output.get("result", "Resposta não encontrada.")
        source_documents = output.get("source_documents", [])
        
        print("Resposta:")
        print(result)
        print("\nDocumentos de origem:")
        for doc in source_documents:
            print(f"- {doc.metadata.get('path', 'Caminho desconhecido')}")
    except Exception as e:
        print(f"Erro ao executar RAG: {e}")