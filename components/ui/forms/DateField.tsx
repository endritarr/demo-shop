import { Field, FieldContent, FieldLabel } from "../field";

export default function DateField({ label, name, value, onChange, ...props }: { label: string, name: string, value: string, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, props: React.ComponentProps<"input"> }) {
    return (
        <Field className="flex-col gap-1">
            <FieldLabel htmlFor={name}>{label}</FieldLabel>
            <FieldContent>
                <input 
                    type="date" 
                    id={name} 
                    name={name} 
                    value={value} 
                    onChange={(e) => onChange(e)} 
                    className="w-full px-4 py-2 rounded-md border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2" 
                    {...props} 
                />
            </FieldContent>
        </Field>
    );
}