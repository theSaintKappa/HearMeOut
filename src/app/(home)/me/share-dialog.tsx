"use client";

import { ClipboardCopy, Loader2, RefreshCw, Share2, Trash2 } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import useSWR from "swr";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import type { ShareStatusResponse } from "@/lib/types";
import { fetcher } from "@/lib/utils";

export function ShareDialog() {
    const [isOpen, setIsOpen] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const { data: shareStatus, mutate } = useSWR<ShareStatusResponse>("/api/me/share", fetcher);

    const shareUrl = shareStatus?.hasSharedStats ? `${window.location.origin}/share/${shareStatus.userId}` : "";

    const handleGenerateLink = async () => {
        setIsGenerating(true);
        try {
            const response = await fetch("/api/me/share", { method: "POST" });
            if (response.ok) {
                const data = (await response.json()) as ShareStatusResponse;
                if (!data.hasSharedStats) throw new Error();
                await mutate(data);
                await handleCopyLink(`${window.location.origin}/share/${data.userId}`);
            } else throw new Error("Failed to generate share link", { cause: await response.json() });
        } catch (error) {
            console.error(error);
            toast.error("Failed to generate share link", { description: error instanceof Error ? error.message : undefined });
        } finally {
            setIsGenerating(false);
        }
    };

    const handleDeleteLink = async () => {
        setIsDeleting(true);
        try {
            const response = await fetch("/api/me/share", { method: "DELETE" });
            if (response.ok) {
                const data = (await response.json()) as ShareStatusResponse;
                await mutate(data);
                toast.success("Share link deleted successfully!");
                setIsOpen(false);
            } else throw new Error("Failed to delete share link", { cause: await response.json() });
        } catch (error) {
            console.error(error);
            toast.error("Failed to delete share link", { description: error instanceof Error ? error.message : undefined });
        } finally {
            setIsDeleting(false);
        }
    };

    const handleCopyLink = async (url = shareUrl) => {
        await navigator.clipboard.writeText(url);
        inputRef.current?.select();
        toast.success("Share link copied to clipboard!");
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button size="sm">
                    <Share2 />
                    Share
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Share Your Stats</DialogTitle>
                    <DialogDescription>
                        Generate a link to your stats page that you can share with others.
                        {shareStatus?.hasSharedStats && (
                            <>
                                <br />
                                Last updated: {new Date(shareStatus.updatedAt).toLocaleString(undefined, { dateStyle: "long", timeStyle: "short" })}
                            </>
                        )}
                    </DialogDescription>
                </DialogHeader>
                {shareStatus?.hasSharedStats ? (
                    <div className="flex flex-col gap-4">
                        <div className="flex gap-2">
                            <Input readOnly value={shareUrl} ref={inputRef} className="select-all" />
                            <Button variant="outline" size="icon" onClick={() => handleCopyLink()}>
                                <ClipboardCopy />
                                <span className="sr-only">Copy Link</span>
                            </Button>
                        </div>
                        <div className="flex gap-2">
                            <Button variant="destructive" className="flex-1" onClick={handleDeleteLink} disabled={isDeleting || isGenerating}>
                                {isDeleting ? <Loader2 className="animate-spin" /> : <Trash2 />}
                                Delete Link
                            </Button>
                            <Button className="flex-1" onClick={handleGenerateLink} disabled={isGenerating || isDeleting}>
                                {isGenerating ? <Loader2 className="animate-spin" /> : <RefreshCw />}
                                Regenerate Link
                            </Button>
                        </div>
                    </div>
                ) : (
                    <Button size="lg" onClick={handleGenerateLink} disabled={isGenerating}>
                        {isGenerating ? <Loader2 className="animate-spin" /> : null}
                        Generate Link
                    </Button>
                )}
            </DialogContent>
        </Dialog>
    );
}
