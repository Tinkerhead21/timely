import { ItemView } from "obsidian";
import { loadFromFileContent, renderDayToUI } from "./dayStore";

export class DayTestView extends ItemView {
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
    if (activeFile) {
      const dayData = await loadFromFileContent(activeFile, this.app);
      renderDayToUI(this.containerEl.children[1] as HTMLElement, dayData);
    }
  }

  async onOpen() {
    await this.updateView();
  }
}
