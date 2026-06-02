import { parseDay } from `./taskParser`;

const mockFileContent = `
## Project Alpha
- Task 1
> todo !1 #work
- [ ] Subtask A
`;

// Running the parser with mock date parameters
const result = parseDay(mockFileContent, "02", "06", "2026");
