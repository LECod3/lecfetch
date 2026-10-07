import { readFile as fsReadFile } from "node:fs/promises";

export async function readFile(path: string): Promise<string | null> {
    try {
        return await fsReadFile(path, 'utf8');
    } catch {
        return null;
    }
}
