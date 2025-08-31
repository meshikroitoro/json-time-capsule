
import * as React from "react";
import type { VariantProps } from "class-variance-authority";
import type { DialogProps } from "@radix-ui/react-dialog";
import type { ToasterToast } from "@/hooks/use-toast";
import { badgeVariants } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { sheetVariants } from "@/components/ui/sheet";
import * as SheetPrimitive from "@radix-ui/react-dialog";

export interface JsonEditorCardProps {
	title: string;
	jsonData: string;
	setJsonData: (value: string) => void;
	lastUpdated: Date;
	handleCopy: (data: string, type: string) => void;
	formatJson: (
		data: string,
		setter: (value: string) => void,
		type: string
	) => void;
	handleJsonChange: (
		value: string,
		setter: (value: string) => void,
		type: string
	) => void;
	editingAllowed: boolean;
	isValidJson: (str: string) => boolean;
	extraButton?: React.ReactNode;
	onSave?: () => void | Promise<void>;
}

export interface AdminDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onChangeEditingAllowed: (editingAllowed: boolean) => void;
	clearPasswordSignal?: boolean;
}

export interface JsonManagerProps {
	editingAllowed: boolean;
	subName: string;
}

export interface HeaderProps {
	onAdminMode?: () => void;
	subName?: string;
	onSubNameChange?: (val: string) => void;
}

export interface State {
	toasts: ToasterToast[];
}

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
	asChild?: boolean;
}

export interface CommandDialogProps extends DialogProps {
	children?: React.ReactNode;
}

export interface SheetContentProps extends React.ComponentPropsWithoutRef<typeof SheetPrimitive.Content>, VariantProps<typeof sheetVariants> {
	side?: "top" | "bottom" | "left" | "right";
	className?: string;
	children?: React.ReactNode;
}

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}
