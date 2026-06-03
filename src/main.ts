import { Plugin, WorkspaceLeaf, ItemView } from "obsidian";
import { loadFromFileContent, renderDayToUI } from "./io/dayStore";

// 🖼️ 1. THE VIEW CLASS (Manages the Sidebar UI)
class DayTestView extends ItemView {
  static readonly VIEW_TYPE = "day-test-view";

  getViewType() {
    return DayTestView.VIEW_TYPE;
  }
  getDisplayText() {
    return "Day Parser Test";
  }
  getIcon() {
    return "dice";
  }

  async updateView() {
    const activeFile = this.app.workspace.getActiveFile();
    const container = this.containerEl.children[1] as HTMLElement;

    if (activeFile) {
      // Load the data from the active file
      const dayData = await loadFromFileContent(activeFile, this.app);
      // Paint it to the screen container
      renderDayToUI(container, dayData);
    } else {
      container.empty();
      container.createEl("p", { text: "No active file open." });
    }
  }

  async onOpen() {
    await this.updateView();
  }
}

// 🔌 2. THE PLUGIN CLASS (The Main Bridge Engine)
export default class DayTestPlugin extends Plugin {
  async onload() {
    // Register our custom view layout blueprint with Obsidian
    this.registerView(
      DayTestView.VIEW_TYPE,
      (leaf: WorkspaceLeaf) => new DayTestView(leaf),
    );

    // Add a clickable button (ribbon icon) on the left sidebar to open the widget
    this.addRibbonIcon("dice", "Open Day Parser Test", () => {
      this.activateView();
    });

    // 🔄 Listen for when the user clicks or switches to a different file
    this.registerEvent(
      this.app.workspace.on("active-leaf-change", async () => {
        const leaves = this.app.workspace.getLeavesOfType(
          DayTestView.VIEW_TYPE,
        );
        if (leaves.length > 0) {
          const view = leaves[0].view as DayTestView;
          await view.updateView();
        }
      }),
    );
  }

  // Helper action to handle spawning the view inside the right sidebar
  async activateView() {
    const { workspace } = this.app;

    let leaf = workspace.getLeavesOfType(DayTestView.VIEW_TYPE)[0];

    if (!leaf) {
      // If the widget isn't open yet, create it in the right sidebar pane
      const rightLeaf = workspace.getRightLeaf(false);
      if (rightLeaf) {
        await rightLeaf.setViewState({
          type: DayTestView.VIEW_TYPE,
          active: true,
        });
        leaf = rightLeaf;
      }
    }

    if (leaf) {
      workspace.revealLeaf(leaf);
    }
  }
}
