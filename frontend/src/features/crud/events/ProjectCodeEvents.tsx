import { Event } from "./Event";
import { UpdateFieldConfig } from "@/types/forms";

interface FieldRenderProps {
  onChange: (value: any) => void;
}

export class ProjectCodeEvents extends Event {
  protected handleChange = (
    value: string,
    renderField: FieldRenderProps,
    updateFieldConfig: UpdateFieldConfig,
    setFieldValue: (fieldName: string, value: any) => void
  ): void => {
    console.log("Project Code custom onChange:", value);

    if (value === "123") {
      updateFieldConfig("project_description", { disable: true });
      setFieldValue("project_description", "valor fixo");
    }
  };
}
