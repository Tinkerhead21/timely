import { App, Plugin, ItemView, WorkspaceLeaf, TFile } from 'obsidian';
import { loadFromFileContent, renderDayToUI } from './dayStore'; // Assuming these are in './dayStore'

// Define the unique view type for our custom pane
const DAILY_NOTE_VIEW_TYPE = 'daily-note-view';

// Custom view class
class DailyNoteView extends ItemView {
    constructor(leaf: WorkspaceLeaf) {
        super(leaf);
    }

    getViewType(): string {
        return DAILY_NOTE_VIEW_TYPE;
    }

    getDisplayText(): string {
        return 'Daily Note View';
    }

    async onOpen() {
        // Clear previous content
        this.containerEl.children[1].empty();

        const activeFile = this.app.workspace.getActiveFile();

        if (activeFile) {
            try {
                // Assume loadFromFileContent is an async function that returns dayData
                const dayData = await loadFromFileContent(activeFile, this.app);
                // Assume renderDayToUI takes the container and the data to render
                renderDayToUI(this.contentEl, dayData);
            } catch (error) {
                console.error("Error loading or rendering daily note:", error);
                this.contentEl.createEl('p', { text: 'Error loading daily note.' });
            }
        } else {
            this.contentEl.createEl('p', { text: 'No active file found.' });
        }
    }

    async onClose() {
        // Cleanup logic if needed
        this.containerEl.children[1].empty();
    }
}

// Main Plugin class
export default class DailyNotePlugin extends Plugin {
    async onload() {
        console.log('Loading Daily Note Plugin...');

        // Register the custom view
        this.registerView(
            DAILY_NOTE_VIEW_TYPE,
            (leaf) => new DailyNoteView(leaf)
        );

        // Add a ribbon icon to open the view
        this.addRibbonIcon('rocket', 'Open Daily Note View', (evt: MouseEvent) => {
            this.activateView();
        });

        // Register event listener for active leaf changes to refresh the view
        this.registerEvent(
            this.app.workspace.on('active-leaf-change', (leaf) => {
                // Check if the current leaf is the one displaying our view
                const currentLeaf = this.app.workspace.getMostRecentLeaf();
                if (currentLeaf && currentLeaf.view instanceof DailyNoteView) {
                    // If it is, refresh it
                    (currentLeaf.view as DailyNoteView).onOpen();
                }
            })
        );
    }

    async onunload() {
        console.log('Unloading Daily Note Plugin...');
        // Cleanup: remove the view from the workspace if it's open
        this.app.workspace.detachLeavesOfType(DAILY_NOTE_VIEW_TYPE);
    }

    async activateView() {
        const { workspace } = this.app;

        let leaf = workspace.getLeavesOfType(DAILY_NOTE_VIEW_TYPE)[0];
        if (!leaf) {
            // If the view doesn't exist, create a new leaf and open it
            leaf = workspace.getRightLeaf(false);
            await leaf.setMyView(new DailyNoteView(leaf));
        }

        // Activate the leaf to make it visible
        workspace.revealLeaf(leaf);
    }
}
