# Task Decomposition

## Description
Break a multi-part task into atomic agent assignments with dependency mapping

## Trigger Phrases
- "decompose this"
- "break this down"
- "task breakdown"
- "atomic tasks"
- "swarm this"

## Process

For each task, create:
- task_id: task_[timestamp]_[seq]
- description: specific, measurable outcome (not vague intent)
- assigned_to: [agent and team]
- priority: critical | high | medium | low
- deadline: realistic estimate
- depends_on: list any blocking tasks
- success_criteria: 2-3 specific measurable outcomes

## Output

1. **Dependency Map**: Show what runs in parallel vs. serial
2. **Sentinel Flags**: Any tasks needing Sentinel clearance before execution
3. **Owner Approval Flags**: Any tasks needing owner approval before execution
4. **Recommended Execution Order**: Your suggested order for execution

## Important
DO NOT start executing anything. Present the decomposition for review first.
