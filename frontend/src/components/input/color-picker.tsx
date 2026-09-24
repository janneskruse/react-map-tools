
"use client";
import { useState, type ComponentProps } from "react";
import { HexColorPicker } from "react-colorful";
import { cn } from "@/utils/shadcn-utils";
import { Button } from "@/components/core/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/core/popover";
import { TextInput } from "@/components/input/input-text";

interface IColorPickerProps {
  value?: string;
  onChange?: (value: string) => void;
  onBlur?: () => void;
}

const ColorPicker = ({
  disabled,
  value,
  onChange,
  onBlur,
  name,
  className,
  ...props
}: Omit<ComponentProps<typeof Button>, "value" | "onChange" | "onBlur"> &
  IColorPickerProps) => {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState(value || "#FFFFFF");

  const handleInputChange = (newValue: string) => {
    const hexValue = newValue.startsWith("#") ? newValue : `#${newValue}`;
    setInputValue(hexValue);
    onChange?.(hexValue);
  };

  return (
    <Popover onOpenChange={setOpen} open={open}>
      <PopoverTrigger asChild disabled={disabled} onBlur={onBlur}>
        <Button
          {...props}
          className={cn("block", className)}
          name={name}
          onClick={() => {
            setOpen(true);
          }}
          size="icon"
          style={{
            backgroundColor: inputValue,
          }}
          variant="outline"
        >
          <div />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full flex flex-col gap-2 p-4">
        <HexColorPicker
          color={inputValue}
          onChange={handleInputChange}
          className="!w-full"
        />
        <TextInput
          id="color-input"
          maxLength={7}
          onChange={(e) => {
            handleInputChange(e?.currentTarget?.value);
          }}
          value={inputValue}
        />
      </PopoverContent>
    </Popover>
  );
};
ColorPicker.displayName = "ColorPicker";

export { ColorPicker };
