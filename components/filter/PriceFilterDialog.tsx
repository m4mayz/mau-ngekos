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
import { TextInput, View } from "react-native";

interface PriceFilterDialogProps {
    minPrice?: number;
    maxPrice?: number;
    onApply: (min?: number, max?: number) => void;
}

export default function PriceFilterDialog({
    minPrice,
    maxPrice,
    onApply,
}: PriceFilterDialogProps) {
    const [open, setOpen] = useState(false);
    const [min, setMin] = useState(minPrice?.toString() || "");
    const [max, setMax] = useState(maxPrice?.toString() || "");

    const handleApply = () => {
        onApply(
            min ? parseInt(min) : undefined,
            max ? parseInt(max) : undefined,
        );
        setOpen(false);
    };

    const handleReset = () => {
        setMin("");
        setMax("");
    };

    const hasValue = !!(minPrice || maxPrice);
    const label = hasValue
        ? `Rp ${(minPrice || 0) / 1000000}jt - ${(maxPrice || 0) / 1000000}jt`
        : "Harga";

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <FilterChip
                    label={label}
                    hasValue={hasValue}
                    onPress={() => setOpen(true)}
                />
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Rentang Harga</DialogTitle>
                    <DialogCloseButton />
                </DialogHeader>

                <View className="flex-row items-center">
                    <View className="flex-1 flex-row items-center bg-gray-50 rounded-xl px-4 h-14">
                        <Text className="text-gray-500 mr-2">Rp</Text>
                        <TextInput
                            placeholder="Min"
                            keyboardType="numeric"
                            value={min}
                            onChangeText={setMin}
                            className="flex-1 text-gray-900"
                            placeholderTextColor="#9CA3AF"
                            style={{ fontFamily: "Manrope_400Regular" }}
                        />
                    </View>
                    <Text className="mx-3 text-gray-400">-</Text>
                    <View className="flex-1 flex-row items-center bg-gray-50 rounded-xl px-4 h-14">
                        <Text className="text-gray-500 mr-2">Rp</Text>
                        <TextInput
                            placeholder="Max"
                            keyboardType="numeric"
                            value={max}
                            onChangeText={setMax}
                            className="flex-1 text-gray-900"
                            placeholderTextColor="#9CA3AF"
                            style={{ fontFamily: "Manrope_400Regular" }}
                        />
                    </View>
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
