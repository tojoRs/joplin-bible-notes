import joplin from "api";
import { SettingItemType } from "api/types";

export namespace settings {
    export async function register() {
        await joplin.settings.registerSection("bibleNotesSection", {
            label: "Bible Notes",
        });

        await joplin.settings.registerSettings({
            lang: {
                value: "fr",
                type: SettingItemType.String,
                isEnum: true,
                section: "bibleNotesSection",
                public: true,
                label: "Plugin Language",
                description: "Language used by the plugin.",
                options: {
                    en: "English",
                    fr: "Français",
                },
            },
        });
    }
}
