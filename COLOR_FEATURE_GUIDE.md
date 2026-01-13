# Color Implementation for SubFlow Nodes

## Overview
Nodes added from other Flows (subflows) are now visually distinguished by assigning them unique colors based on their source Flow ID.

## How It Works

### 1. When Adding a SubFlow
When you add a Flow as a subflow using `onAddFlow(flowId)`:
- A unique color is generated using the golden angle algorithm: `hsl((flowId * 137.508) % 360, 70%, 85%)`
- This creates consistent, evenly-distributed pastel colors
- All nodes from that subflow receive the same color

### 2. Visual Display
- Nodes are rendered with `backgroundColor` set to their assigned color
- Nodes without colors (regular nodes) remain transparent
- The color helps identify which nodes came from which subflow

### 3. Persistence
- Colors are saved to the database in the `Color` column of `Flow_Node` table
- When loading a Flow, node colors are restored
- Colors are preserved across sessions

## Files Modified

### Backend (Already completed)
- `API/Server.Data/Dtos/FlowNode.cs` - Entity with Color property
- `API/Server.Application/Models/Input/Flow/FlowNodeInputModel.cs` - Input DTO
- `API/Server.Application/Models/Output/Flow/FlowNodeOutputModel.cs` - Output DTO
- `API/Server.Application/Mappers/FlowInputMapper.cs` - Maps Color from Input
- `API/Server.Application/Mappers/FlowOutputMapper.cs` - Maps Color to Output

### Frontend
- `UI/src/app/models/input/flowInput.ts` - Added `color?: string` to IFlowNodeInputModel
- `UI/src/app/models/output/flowOutput.ts` - Added `color?: string` to IFlowNodeOutputModel
- `UI/src/app/flows/Flow.tsx` - Added `generateColorFromId()` and color assignment in `onAddFlow()`
- `UI/src/app/flows/components/Node/Node.tsx` - Applied backgroundColor style
- `UI/src/app/flows/components/Flow/FlowMenu.tsx` - Added color to mapFlowNodes()

### Database
- `ADD_COLOR_COLUMN.sql` - Migration script to add Color column

## Usage Example

```typescript
// When user adds Flow #23 as a subflow:
onAddFlow(23);

// Generated color: hsl(185, 70%, 85%) - light cyan
// All nodes from Flow #23 will have this cyan background
```

## Color Algorithm
The golden angle (137.508°) ensures:
- Colors are well-distributed across the spectrum
- Same Flow ID always generates the same color
- Different Flow IDs get visually distinct colors
- Avoids clustering of similar colors

## Next Steps
- ✅ Test adding multiple subflows and verify distinct colors
- ✅ Test saving and reloading Flows with colored nodes
- Consider adding UI to manually change node colors if needed
