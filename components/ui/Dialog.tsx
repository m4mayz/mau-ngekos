import { cn } from "@/lib/utils";
import { Monicon } from "@monicon/native";
import * as DialogPrimitive from "@rn-primitives/dialog";
import * as React from "react";
import { Platform, View, type ViewProps } from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";

const Dialog = DialogPrimitive.Root;
const DialogTrigger = DialogPrimitive.Trigger;
const DialogPortal = DialogPrimitive.Portal;
const DialogClose = DialogPrimitive.Close;

function DialogOverlay({
    className,
    children,
    ...props
}: Omit<DialogPrimitive.OverlayProps, "asChild"> &
    React.RefAttributes<DialogPrimitive.OverlayRef> & {
        children?: React.ReactNode;
    }) {
    return (
        <DialogPrimitive.Overlay
            className={cn(
                "absolute bottom-0 left-0 right-0 top-0 flex items-end justify-center bg-black/50",
                className,
            )}
            {...props}
            asChild={Platform.OS !== "web"}
        >
            <Animated.View
                entering={FadeIn.duration(200)}
                exiting={FadeOut.duration(150)}
                className="flex-1 items-end justify-end"
            >
                {children}
            </Animated.View>
        </DialogPrimitive.Overlay>
    );
}

function DialogContent({
    className,
    portalHost,
    children,
    ...props
}: DialogPrimitive.ContentProps &
    React.RefAttributes<DialogPrimitive.ContentRef> & {
        portalHost?: string;
    }) {
    return (
        <DialogPortal hostName={portalHost}>
            <DialogOverlay>
                <DialogPrimitive.Content
                    className={cn(
                        "bg-white w-full rounded-t-3xl p-6 shadow-lg",
                        className,
                    )}
                    {...props}
                >
                    <Animated.View entering={FadeIn.delay(50)}>
                        {children}
                    </Animated.View>
                </DialogPrimitive.Content>
            </DialogOverlay>
        </DialogPortal>
    );
}

function DialogHeader({ className, ...props }: ViewProps) {
    return (
        <View
            className={cn(
                "flex-row items-center justify-between mb-4",
                className,
            )}
            {...props}
        />
    );
}

function DialogFooter({ className, ...props }: ViewProps) {
    return <View className={cn("flex-row gap-3 mt-4", className)} {...props} />;
}

function DialogTitle({
    className,
    ...props
}: DialogPrimitive.TitleProps & React.RefAttributes<DialogPrimitive.TitleRef>) {
    return (
        <DialogPrimitive.Title
            className={cn("text-lg font-bold text-gray-900", className)}
            {...props}
        />
    );
}

function DialogDescription({
    className,
    ...props
}: DialogPrimitive.DescriptionProps &
    React.RefAttributes<DialogPrimitive.DescriptionRef>) {
    return (
        <DialogPrimitive.Description
            className={cn("text-sm text-gray-500", className)}
            {...props}
        />
    );
}

function DialogCloseButton() {
    return (
        <DialogPrimitive.Close className="rounded-full p-1">
            <Monicon
                name="material-symbols:close-rounded"
                size={24}
                color="#6B7280"
            />
        </DialogPrimitive.Close>
    );
}

export {
    Dialog,
    DialogClose,
    DialogCloseButton,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogOverlay,
    DialogPortal,
    DialogTitle,
    DialogTrigger,
};
