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
    console.log("🔄 updateView() triggered!"); // Log 1

    const activeFile = this.app.workspace.getActiveFile();
    const container = this.containerEl.children[1] as HTMLElement;

    console.log(
      "📂 Active File identified:",
      activeFile ? activeFile.path : "None",
    ); // Log 2

    if (activeFile) {
      try {
        console.log("⚙️ Attempting to parse file contents..."); // Log 3
        const dayData = await loadFromFileContent(activeFile, this.app);

        console.log("📦 Parsed Day Data payload:", dayData); // Log 4

        renderDayToUI(container, dayData);
        console.log("🎨 renderDayToUI execution complete!"); // Log 5
      } catch (parseError) {
        console.error(
          "❌ Error caught during parsing/rendering cycle:",
          parseError,
        );
      }
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
