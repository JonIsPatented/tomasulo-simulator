# Tomasulo Simulator — User Guide

## Overview
The Tomasulo Simulator is an interactive visualization of Tomasulo’s Algorithm applied to a RISC‑V program. It allows you to step through execution one cycle at a time or run continuously while observing how instructions flow through the processor, resolve data hazards, and execute out of order.

This simulator is designed to help you:
- Understand dynamic scheduling
- Visualize register renaming
- Observe out-of-order execution and in-order retirement
- See data movement through the Common Data Bus (CDB) in real time

## Getting Started

### Basic Workflow
1. Open the Settings menu
2. Configure operation latencies using the sliders (optional)
3. Paste your RISC‑V assembly code into the input area
4. Assemble and load the program
5. Click Start to run continuously, or Step to advance cycle-by-cycle

**Important:** Once execution begins for the first time, settings and code input become locked and cannot be modified until the simulator is reset.

### Top-Level Controls

Located at the top of the interface:
- **Settings** - Open the Settings menu
- **Cycle Counter** - Displays the current clock cycle
- **Step** - Advance the simulation by exactly one cycle
- **Start** - Run the simulation continuously
- **Stop** - Pause execution
- **Ticks/Sec** - Controls execution speed in continuous mode

## Interface Layout
The simulator is organized into logical units that mirror Tomasulo’s architecture. The flow generally proceeds top to bottom, matching instruction issue, execution, and write-back.

### Instruction Queue
The Instruction Queue shows all instructions that have been assembled and loaded but not yet issued. Instructions leave the queue when issued to a reservation station.

### Instruction History
The Instruction History tracks completed work.

Columns:
- **Instruction** - Original assembly instruction
- **Issued On** - Cycle when the instruction was issued
- **Completed On** - Cycle when the instruction finished write-back

This view is especially useful for observing:
- Out-of-order completion
- Performance effects of latency changes

### Register File
The Register File displays architectural registers and their current state.

Columns:
- **Register** - Register name (e.g. f0, f1)
- **Value** - The current stored value (if available)
- **Tag** - The reservation station producing the value (if pending)

#### Understanding Tags
A blank tag means the register value is valid. A non-empty tag means the register is waiting for a result. Tags implement register renaming, which eliminates stale dependencies.

### Reservation Stations
Reservation stations hold instructions that have been issued but are waiting for operands or execution resources.
**Add/Sub** reservation stations are used for floating-point addition and subtraction operations.
**Mul/Div** reservation stations are used for floating-point multiplication and division operations.

Columns:
- **Name** - RS identifier (e.g. RS0, RS1)
- **Op** - Operation
- **Arg1 / Arg2** - Operand values or tags
- **Status** - Free, Waiting, Ready, or Running

#### Key Behavior
Instructions wait here without blocking others. An instruction can begin execution as soon as its operands are ready and a function unit is available.

### Function Units
The Function Units section shows instructions currently executing.
Separate units exist for **Add/Subtract** and **Multiply/Divide**.

Columns:
- **Op** - Operation being executed
- **Arg1 / Arg2** - Operand values
- **Ticks Left** - Remaining cycles before completion
- **Source** - Reservation station that issued the instruction

#### Execution Notes
- Function units are exclusive (one instruction at a time)
- Execution time is determined by settings
- Results are broadcast on the Common Data Bus when execution completes

### Load / Store Buffers
Memory operations use separate buffers:

**Load Buffers** track pending memory reads and hold effective addresses and destination tags.

**Store Buffers** track pending memory writes and hold addresses and values until the store commits.

This separation allows loads and stores to proceed independently of arithmetic instructions, and it allows for controlled memory ordering behavior.

### Memory Unit
The Memory Unit displays memory contents in word-aligned addresses.

Features:
- View values by address
- Jump directly to a specific address
- Observe stores updating memory and loads retrieving values

#### Notes
- Addresses are word-aligned

### Visual Data Flow (Arrows)
A key feature of the simulator is animated data flow arrows. Arrows light up when data is transmitted from one component to another, and the direction indicates source and destination. These arrows illustrate how multiple consumers can simultaneously receive and process results and how dependencies are resolved dynamically.

### Common Data Bus
The Common Data Bus appears as a thick wire that lights up when data is broadcast. The source, destination, and value being broadcast is displayed below the bus while it is active.

### Settings Menu
The settings menu contains various controls for simulation configuration.

#### Operation Latency Sliders
Each slider controls how many cycles an operation requires.

#### RISC‑V Code Input
Paste valid RISC‑V assembly code into the field and click the **Import Code** button. Code is assembled and loaded into the instruction queue.

##### Locking Behavior
Once execution begins:
- Sliders are disabled
- Code input becomes read-only

This ensures:
- Deterministic simulation behavior
- Repeatable experiments

Settings unlock only after a reset.

## Execution Model
Each simulation cycle performs the following conceptual stages:
- **Write-Back** *(Only if Broadcast happened previous cycle)* - All components waiting for broadcast data read from the Common Data Bus if the bus is broadcasting the data they are waiting for
- **Issue** - Instructions are issued if a reservation station is free
- **Execute** - Instructions are dispatched to function units if ready
- **Broadcast** - Results are broadcast on the CDB

### Step Mode
- Advances one cycle per click
- Ideal for learning and debugging
- Makes data flow and structural hazards easier to observe

### Continuous Mode
- Runs automatically at selected speed
- Useful for overall performance analysis

## Limitations and Assumptions
This simulator intentionally simplifies some aspects of real processors:
- Limited instruction subset
- Simplified memory model
- No branch prediction or speculative execution

These trade-offs improve clarity and educational value.
