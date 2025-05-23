import { UpdateFieldConfig } from '@/types/forms';

interface FieldRenderProps {
  onChange: (value: any) => void;
  onBlur?: (value: any) => void;
}

/**
 * Classe base para tratamento de eventos customizados em campos de formulários.
 *
 * Fornece implementações padrão para eventos comuns de formulário,
 * permitindo que classes filhas sobrescrevam para adicionar lógicas específicas.
 */
export class Event {
  /**
   * Manipula o evento onChange de um campo.
   */
  protected handleChange(
    value: any,
    renderField: FieldRenderProps,
    updateFieldConfig: UpdateFieldConfig,
    setFieldValue: (fieldName: string, value: any) => void
  ): void {
    // Método a ser sobrescrito pelas classes filhas
  }

  /**
   * Wrapper que executa a lógica customizada e depois atualiza o campo
   */
  onChange(
    value: any,
    renderField: FieldRenderProps,
    updateFieldConfig: UpdateFieldConfig,
    setFieldValue: (fieldName: string, value: any) => void
  ): void {
    this.handleChange(value, renderField, updateFieldConfig, setFieldValue);
    renderField.onChange(value);
  }

  /**
   * Manipula o evento onBlur de um campo.
   *
   * @param value - Valor atual do campo
   * @param renderField - Props de renderização do react-hook-form
   * @param updateFieldConfig - Função para atualizar configurações do campo
   * @param setFieldValue - Função para atualizar valor de qualquer campo
   */
  onBlur(
    value: any,
    renderField: FieldRenderProps,
    updateFieldConfig: UpdateFieldConfig,
    setFieldValue: (fieldName: string, value: any) => void
  ): void {
    renderField.onBlur?.(value);
  }
}
