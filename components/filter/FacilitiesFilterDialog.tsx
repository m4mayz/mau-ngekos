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
import { ScrollView, TouchableOpacity, View } from "react-native";

export const ROOM_FACILITIES = [
    "K. Mandi Dalam",
    "Kloset Duduk",
    "Air Panas",
    "Kasur",
    "Lemari",
    "TV",
    "AC",
    "Meja",
    "Kursi",
    "Kipas Angin",
    "Jendela",
    "Termasuk Listrik",
];

export const SHARED_FACILITIES = [
    "WiFi",
    "Parkir Mobil",
    "Parkir Motor",
    "Dapur",
    "Mesin Cuci",
    "Penjaga Kos",
    "Laundry",
    "Mushola",
    "Kulkas",
    "Dispenser",
    "TV Bersama",
    "R. Keluarga",
];

interface FacilitiesFilterDialogProps {
    roomFacilities: string[];
    sharedFacilities: string[];
    onApply: (room: string[], shared: string[]) => void;
}

export default function FacilitiesFilterDialog({
    roomFacilities,
    sharedFacilities,
    onApply,
}: FacilitiesFilterDialogProps) {
    const [open, setOpen] = useState(false);
    const [selectedRoom, setSelectedRoom] = useState<string[]>(roomFacilities);
    const [selectedShared, setSelectedShared] =
        useState<string[]>(sharedFacilities);

    const handleApply = () => {
        onApply(selectedRoom, selectedShared);
        setOpen(false);
    };

    const handleReset = () => {
        setSelectedRoom([]);
        setSelectedShared([]);
    };

    const toggleRoom = (facility: string) => {
        setSelectedRoom((prev) =>
            prev.includes(facility)
                ? prev.filter((f) => f !== facility)
                : [...prev, facility],
        );
    };

    const toggleShared = (facility: string) => {
        setSelectedShared((prev) =>
            prev.includes(facility)
                ? prev.filter((f) => f !== facility)
                : [...prev, facility],
        );
    };

    const totalSelected = roomFacilities.length + sharedFacilities.length;
    const hasValue = totalSelected > 0;
    const label = hasValue ? `${totalSelected} Fasilitas` : "Fasilitas";

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
            <DialogContent className="max-h-[70%]">
                <DialogHeader>
                    <DialogTitle>Fasilitas</DialogTitle>
                    <DialogCloseButton />
                </DialogHeader>

                <ScrollView showsVerticalScrollIndicator={false}>
                    {/* Room Facilities */}
                    <Text weight="semibold" className="text-gray-900 mb-3">
                        Fasilitas Kamar
                    </Text>
                    <View className="flex-row flex-wrap mb-4">
                        {ROOM_FACILITIES.map((facility) => (
                            <TouchableOpacity
                                key={facility}
                                onPress={() => toggleRoom(facility)}
                                className={`mr-2 mb-2 px-3 py-1.5 rounded-full border ${
                                    selectedRoom.includes(facility)
                                        ? "bg-primary border-primary"
                                        : "bg-white border-gray-200"
                                }`}
                            >
                                <Text
                                    className={`text-sm ${
                                        selectedRoom.includes(facility)
                                            ? "text-white"
                                            : "text-gray-700"
                                    }`}
                                >
                                    {facility}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    {/* Shared Facilities */}
                    <Text weight="semibold" className="text-gray-900 mb-3">
                        Fasilitas Bersama
                    </Text>
                    <View className="flex-row flex-wrap">
                        {SHARED_FACILITIES.map((facility) => (
                            <TouchableOpacity
                                key={facility}
                                onPress={() => toggleShared(facility)}
                                className={`mr-2 mb-2 px-3 py-1.5 rounded-full border ${
                                    selectedShared.includes(facility)
                                        ? "bg-primary border-primary"
                                        : "bg-white border-gray-200"
                                }`}
                            >
                                <Text
                                    className={`text-sm ${
                                        selectedShared.includes(facility)
                                            ? "text-white"
                                            : "text-gray-700"
                                    }`}
                                >
                                    {facility}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </ScrollView>

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
