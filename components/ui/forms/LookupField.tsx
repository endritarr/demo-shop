import { Field, FieldLabel, FieldContent } from "../field";
import { ChevronDownIcon } from "lucide-react";

export default function LookupField({ label, name, value, onChange, options, ...props }: { label: string, name: string, value: string, onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void, options: { label: string, value: string }[], props: React.ComponentProps<"select"> }) {
    return (
        <Field className="flex-col gap-1">
            <FieldLabel htmlFor={name}>{label}</FieldLabel>
            <FieldContent>
                <div className="relative w-full">
                    <select 
                        id={name} 
                        name={name} 
                        value={value} 
                        onChange={(e) => onChange(e)} 
                        className="w-full px-4 py-2 rounded-md border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 appearance-none" 
                        {...props}
                    >
                        <option value="" disabled>Select an option</option>
                        {options.map((option) => (
                            <option key={option.value} value={option.value}>{option.label}</option>
                        ))}
                    </select>
                    <ChevronDownIcon className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                </div>
            </FieldContent>
        </Field>
    );
}
