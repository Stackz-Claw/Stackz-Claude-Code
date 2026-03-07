---
description: Break a multi-part task into atomic agent assignments with dependency mapping
---

Decompose this request into atomic tasks for the swarm. For each task:

- task_id: task_[timestamp]_[seq]
- description: specific, measurable outcome (not vague intent)
- assigned_to: [agent and team]
- priority: critical | high | medium | low
- deadline: realistic estimate
- depends_on: list any blocking tasks
- success_criteria: 2-3 specific measurable outcomes

Then:
- Show me the dependency map (what runs in parallel vs. serial)
- Flag any tasks that need Sentinel clearance before execution
- Flag any tasks that need owner approval before execution
- Give me your recommended execution order

Do NOT start executing anything. Present the decomposition for my review first.
