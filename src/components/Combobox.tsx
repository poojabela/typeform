import {
  Button,
  ComboBox as PComboBox,
  ComboBoxProps,
  FieldError,
  Input,
  Label,
  ListBox,
  Popover,
  Text,
  ValidationResult,
} from "react-aria-components";

import { ChevronsUpDown } from "lucide-react";

interface MyComboBoxProps<T extends object>
  extends Omit<ComboBoxProps<T>, "children"> {
  label?: string;
  description?: string | null;
  errorMessage?: string | ((validation: ValidationResult) => string);
  children: React.ReactNode | ((item: T) => React.ReactNode);
}

export function Combobox<T extends object>({
  label,
  description,
  errorMessage,
  children,
  className,
  ...props
}: MyComboBoxProps<T>) {
  return (
    <PComboBox className={["relative", className].join(" ")} {...props}>
      <Label>{label}</Label>
      <div className="w-full border-b-2 border-b-white/30 flex flex-row py-3 text-3xl focus-within:border-b-white duration-300">
        <Input
          className={"bg-transparent flex-1 focus:outline-none outline-none"}
        />
        <Button>
          <ChevronsUpDown size={20} />
        </Button>
      </div>
      {description && <Text slot="description">{description}</Text>}
      <FieldError>{errorMessage}</FieldError>
      <Popover
        className={
          "w-[--trigger-width] p-2 rounded-lg border border-white/10 bg-white/10 backdrop-blur-sm mt-3"
        }
      >
        <ListBox className={"flex flex-col gap-2 max-h-[40vh] overflow-y-auto"}>
          {children}
        </ListBox>
      </Popover>
    </PComboBox>
  );
}
