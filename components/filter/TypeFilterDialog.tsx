import Button from "@/components/ui/Button";
import {
    Dialog,
    DialogCloseButton,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/Dialog";
import FilterChip from "@/components/ui/FilterChip";
import Text from "@/components/ui/Text";
import { useState } from "react";
import { TouchableOpacity, View } from "react-native";

type KosType = "putra" | "putri" | "campur" | null;

interface TypeFilterDialogProps {
    value: KosType;
    onApply: (type: KosType) => void;
}

export default function TypeFilterDialog({
    value,
    onApply,
}: TypeFilterDialogProps) {
    const [open, setOpen] = useState(false);
    const [selected, setSelected] = useState<KosType>(value);

    const handleApply = () => {
        onApply(selected);
        setOpen(false);
    };

    const handleReset = () => {
        setSelected(null);
    };

    const types: { value: KosType; label: string }[] = [
        { value: "putra", label: "Khusus Putra" },
        { value: "putri", label: "Khusus Putri" },
        { value: "campur", label: "Campur" },
    ];

    const hasValue = !!value;
    const label = value
        ? value === "putra"
            ? "Putra"
            : value === "putri"
              ? "Putri"
              : "Campur"
        : "Tipe";

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <FilterChip
                    label={label}
                    hasValue={hasValue}
                    onPress={() => setOpen(true)}
                    showDropdown={false}
                />
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Tipe Kosan</DialogTitle>
                    <DialogCloseButton />
                </DialogHeader>

                <View className="flex-row flex-wrap">
                    {types.map((type) => (
                        <TouchableOpacity
                            key={type.value}
                            onPress={() =>
                                setSelected(
                                    selected === type.value ? null : type.value,
                                )
                            }
                            className={`mr-3 mb-3 px-5 py-3 rounded-full border ${
                                selected === type.value
                                    ? "bg-primary border-primary"
                                    : "bg-white border-gray-200"
                            }`}
                        >
                            <Text
                                weight="medium"
                                className={
                                    selected === type.value
                                        ? "text-white"
                                        : "text-gray-700"
                                }
                            >
                                {type.label}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                <DialogFooter>
                    <Button
                        variant="outline"
                        onPress={handleReset}
                        className="flex-1"
                    >
                        Reset
                    </Button>
                    <Button
                        variant="primary"
                        onPress={handleApply}
                        className="flex-1"
                    >
                        Terapkan
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
