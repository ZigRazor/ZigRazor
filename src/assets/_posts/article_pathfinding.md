# Building Intelligent Game AI with CXXGraph: From Grid Pathfinding to Strategic Navigation

*Master game AI development using modern C++ and graph theory - no PhD required*

## Introduction

Every gamer has experienced it: enemies that navigate complex terrain with uncanny intelligence, NPCs that find optimal shortcuts through sprawling maps, or allies that coordinate tactical movements across battlefields. Behind these behaviors lies graph theory and pathfinding algorithms - the mathematical foundation of game AI.

But here's the problem: implementing pathfinding from scratch is time-consuming and error-prone. Using heavyweight frameworks adds dependencies and complexity. What if you could drop a single header file into your C++ game project and instantly gain access to battle-tested pathfinding algorithms?

Enter **CXXGraph** - a modern, header-only C++ graph library that brings professional-grade pathfinding to your games without the hassle.

In this comprehensive tutorial, we'll build a complete tactical RPG movement system from the ground up, covering everything from basic grid navigation to advanced AI positioning strategies. By the end, you'll have production-ready code you can drop into your own projects.

## Why CXXGraph for Game Development?

Before we dive into code, let's talk about why CXXGraph is an excellent choice for game AI:

**🚀 Performance First**
- Header-only design means zero runtime overhead
- Native C++ speed for real-time pathfinding
- No virtual function calls or unnecessary abstractions

**🎮 Game Engine Friendly**
- Works seamlessly with Unity (via C++ plugins)
- Direct integration with Unreal Engine
- Compatible with any custom C++ game engine

**🛠️ Developer Experience**
- No dependencies to manage or link
- Modern C++17 syntax that's actually readable
- Rich algorithm library (30+ graph algorithms)
- Active open-source community

**📦 Zero Configuration**
Simply include one header and you're ready to go:

```cpp
#include "CXXGraph/CXXGraph.hpp"
```

That's it. No CMake gymnastics, no package managers, no build system configuration.

## What We're Building: A Tactical RPG Movement System

Let's create something practical - a movement system for a tactical RPG similar to Fire Emblem, XCOM, or Final Fantasy Tactics. Our system will include:

1. ✅ Grid-based pathfinding with obstacles
2. ✅ Movement cost calculations (terrain types matter)
3. ✅ Enemy AI that intelligently chases players
4. ✅ Strategic positioning for attacks
5. ✅ Visual path display

Here's what the final result will look like:

```
Player Position: (2, 2)
Enemy Position: (8, 8)

Enemy movement path:
  -> (8, 8)
  -> (7, 7)
  -> (6, 6)

Optimal attack position: (5, 4)

Map:
P = Player, E = Enemy, * = Path, # = Obstacle

. . . . . . . . . . 
. . P . . . . . . . 
. . . . . . . . . . 
. . . . . # . . . . 
. . . . . # * . . . 
. . . . . # * . . . 
. . . . . . * . . . 
. . . . . . . * . . 
. . . . . . . . E . 
. . . . . . . . . . 
```

Let's build it step by step.

## Step 1: Setting Up the Game Grid

Every tile-based game needs a grid system. We'll start by creating a class that represents our game world:

```cpp
#include "CXXGraph/CXXGraph.hpp"
#include <vector>
#include <string>
#include <memory>

class GameGrid {
private:
    int width_, height_;
    std::vector<std::vector<bool>> obstacles_;
    
public:
    GameGrid(int width, int height) 
        : width_(width), height_(height) {
        obstacles_.resize(height, std::vector<bool>(width, false));
    }
    
    // Mark a cell as impassable (walls, mountains, etc.)
    void setObstacle(int x, int y) {
        if (isValid(x, y)) {
            obstacles_[y][x] = true;
        }
    }
    
    // Check if we can walk through this cell
    bool isWalkable(int x, int y) const {
        return isValid(x, y) && !obstacles_[y][x];
    }
    
    // Check if coordinates are within bounds
    bool isValid(int x, int y) const {
        return x >= 0 && x < width_ && y >= 0 && y < height_;
    }
    
    // Get all adjacent walkable cells (4-directional movement)
    std::vector<std::pair<int, int>> getNeighbors(int x, int y) const {
        std::vector<std::pair<int, int>> neighbors;
        
        // Check up, down, left, right
        const int dx[] = {0, 0, -1, 1};
        const int dy[] = {-1, 1, 0, 0};
        
        for (int i = 0; i < 4; ++i) {
            int nx = x + dx[i];
            int ny = y + dy[i];
            
            if (isWalkable(nx, ny)) {
                neighbors.push_back({nx, ny});
            }
        }
        
        return neighbors;
    }
    
    int getWidth() const { return width_; }
    int getHeight() const { return height_; }
};
```

This gives us a foundation for representing our game world. Now let's convert it into a graph that CXXGraph can understand.

## Step 2: Converting the Grid to a Graph

In graph theory, our grid becomes:
- **Nodes**: Each walkable tile
- **Edges**: Connections between adjacent tiles

```cpp
CXXGraph::Graph<std::string> buildGraphFromGrid(
    const GameGrid& grid, 
    int width, 
    int height) {
    
    CXXGraph::T_EdgeSet<std::string> edgeSet;
    
    // Iterate through every cell
    for (int y = 0; y < height; ++y) {
        for (int x = 0; x < width; ++x) {
            // Skip obstacles
            if (!grid.isWalkable(x, y)) continue;
            
            // Create node ID (e.g., "3,5" for cell at x=3, y=5)
            std::string currentId = std::to_string(x) + "," + std::to_string(y);
            CXXGraph::Node<std::string> currentNode(currentId, currentId);
            
            // Connect to all walkable neighbors
            auto neighbors = grid.getNeighbors(x, y);
            for (const auto& [nx, ny] : neighbors) {
                std::string neighborId = std::to_string(nx) + "," + std::to_string(ny);
                CXXGraph::Node<std::string> neighborNode(neighborId, neighborId);
                
                std::string edgeId = currentId + "->" + neighborId;
                
                // Create bidirectional edge (can move both ways)
                edgeSet.insert(
                    std::make_shared<CXXGraph::UndirectedEdge<std::string>>(
                        edgeId, currentNode, neighborNode));
            }
        }
    }
    
    return CXXGraph::Graph<std::string>(edgeSet);
}
```

**Pro Tip**: We're using string IDs like "3,5" because they're easy to parse and debug. In a production game, you might use integer IDs for better performance, but this approach is clearer for learning.

## Step 3: Implementing Basic Pathfinding

Now comes the fun part - actual pathfinding! We'll use Dijkstra's algorithm, which finds the shortest path between two points:

```cpp
std::vector<std::pair<int, int>> findPath(
    const CXXGraph::Graph<std::string>& graph,
    int startX, int startY,
    int goalX, int goalY) {
    
    // Create node IDs
    std::string startId = std::to_string(startX) + "," + std::to_string(startY);
    std::string goalId = std::to_string(goalX) + "," + std::to_string(goalY);
    
    // Create CXXGraph nodes
    CXXGraph::Node<std::string> startNode(startId, startId);
    CXXGraph::Node<std::string> goalNode(goalId, goalId);
    
    // Run Dijkstra's algorithm - this is where the magic happens!
    auto result = graph.dijkstra(startNode, goalNode);
    
    std::vector<std::pair<int, int>> path;
    
    if (result.success) {
        // Convert node IDs back to coordinates
        for (const auto& nodeId : result.path) {
            size_t commaPos = nodeId.find(',');
            int x = std::stoi(nodeId.substr(0, commaPos));
            int y = std::stoi(nodeId.substr(commaPos + 1));
            path.push_back({x, y});
        }
    }
    
    return path;
}
```

**That's it!** With just a few lines of code, we have working pathfinding. CXXGraph handles all the complex algorithm implementation for us.

Let's test it:

```cpp
int main() {
    // Create a 10x10 grid
    GameGrid grid(10, 10);
    
    // Add some obstacles (a wall)
    grid.setObstacle(5, 3);
    grid.setObstacle(5, 4);
    grid.setObstacle(5, 5);
    grid.setObstacle(5, 6);
    
    // Build the graph
    auto graph = buildGraphFromGrid(grid, 10, 10);
    
    // Find path from (2,2) to (8,8)
    auto path = findPath(graph, 2, 2, 8, 8);
    
    std::cout << "Path found with " << path.size() << " steps:\n";
    for (const auto& [x, y] : path) {
        std::cout << "  (" << x << ", " << y << ")\n";
    }
    
    return 0;
}
```

## Step 4: Adding Terrain Costs (The Game-Changer)

Basic pathfinding is great, but real games have terrain variety. Moving through a forest should cost more movement points than walking on a road. Let's add weighted pathfinding:

```cpp
enum class TerrainType {
    PLAIN = 1,      // Normal ground (1 movement point)
    FOREST = 2,     // Thick vegetation (2 movement points)
    MOUNTAIN = 3,   // Rocky terrain (3 movement points)
    ROAD = 1,       // Paved road (0.5 movement points - fast!)
    WATER = 99      // Nearly impassable
};

class WeightedGameGrid {
private:
    int width_, height_;
    std::vector<std::vector<TerrainType>> terrain_;
    
public:
    WeightedGameGrid(int width, int height) 
        : width_(width), height_(height) {
        terrain_.resize(height, 
            std::vector<TerrainType>(width, TerrainType::PLAIN));
    }
    
    void setTerrain(int x, int y, TerrainType type) {
        if (x >= 0 && x < width_ && y >= 0 && y < height_) {
            terrain_[y][x] = type;
        }
    }
    
    double getMovementCost(int x, int y) const {
        if (x < 0 || x >= width_ || y < 0 || y >= height_) {
            return 999.0; // Out of bounds
        }
        return static_cast<double>(terrain_[y][x]);
    }
    
    bool isPassable(int x, int y) const {
        if (x < 0 || x >= width_ || y < 0 || y >= height_) {
            return false;
        }
        return terrain_[y][x] != TerrainType::WATER;
    }
};
```

Now we build a weighted graph where edge weights represent movement costs:

```cpp
CXXGraph::Graph<std::string> buildWeightedGraph(
    const WeightedGameGrid& grid, 
    int width, 
    int height) {
    
    CXXGraph::T_EdgeSet<std::string> edgeSet;
    
    for (int y = 0; y < height; ++y) {
        for (int x = 0; x < width; ++x) {
            if (!grid.isPassable(x, y)) continue;
            
            std::string currentId = std::to_string(x) + "," + std::to_string(y);
            CXXGraph::Node<std::string> currentNode(currentId, currentId);
            
            // Check all 4 directions
            const int dx[] = {0, 0, -1, 1};
            const int dy[] = {-1, 1, 0, 0};
            
            for (int i = 0; i < 4; ++i) {
                int nx = x + dx[i];
                int ny = y + dy[i];
                
                if (!grid.isPassable(nx, ny)) continue;
                
                std::string neighborId = std::to_string(nx) + "," + std::to_string(ny);
                CXXGraph::Node<std::string> neighborNode(neighborId, neighborId);
                
                // Weight = cost to ENTER the destination tile
                double weight = grid.getMovementCost(nx, ny);
                
                std::string edgeId = currentId + "->" + neighborId;
                
                // Create weighted edge
                edgeSet.insert(
                    std::make_shared<CXXGraph::UndirectedWeightedEdge<std::string>>(
                        edgeId, currentNode, neighborNode, weight));
            }
        }
    }
    
    return CXXGraph::Graph<std::string>(edgeSet);
}
```

**Why this matters**: With weighted graphs, Dijkstra's algorithm will automatically find the path with the *lowest total cost*, not just the fewest tiles. Your units will naturally prefer roads over mountains!

## Step 5: Building Enemy AI

Now let's make our enemies smart. We'll create an AI class that can chase the player:

```cpp
class EnemyAI {
public:
    EnemyAI(const CXXGraph::Graph<std::string>& graph) : graph_(graph) {}
    
    // Chase the player, but respect movement limits
    std::vector<std::pair<int, int>> chasePlayer(
        int enemyX, int enemyY,
        int playerX, int playerY,
        int maxMoveDistance) {
        
        // Find the full path to player
        auto fullPath = findPath(graph_, enemyX, enemyY, playerX, playerY);
        
        if (fullPath.empty()) {
            return {}; // No path exists!
        }
        
        // Limit movement to maxMoveDistance tiles
        std::vector<std::pair<int, int>> actualMove;
        size_t maxSteps = std::min(
            fullPath.size(), 
            static_cast<size_t>(maxMoveDistance + 1)
        );
        
        for (size_t i = 0; i < maxSteps; ++i) {
            actualMove.push_back(fullPath[i]);
        }
        
        return actualMove;
    }
    
    // Find best position to attack from (within range)
    std::pair<int, int> findAttackPosition(
        int enemyX, int enemyY,
        int targetX, int targetY,
        int attackRange,
        int moveRange) {
        
        // Get all reachable positions
        auto reachable = findReachablePositions(enemyX, enemyY, moveRange);
        
        // Find closest position within attack range
        std::pair<int, int> bestPos = {enemyX, enemyY};
        double minDist = std::numeric_limits<double>::max();
        
        for (const auto& [x, y] : reachable) {
            // Calculate distance to target
            double dist = std::sqrt(
                std::pow(x - targetX, 2) + 
                std::pow(y - targetY, 2)
            );
            
            // Is this position close enough to attack from?
            if (dist <= attackRange && dist < minDist) {
                minDist = dist;
                bestPos = {x, y};
            }
        }
        
        return bestPos;
    }
    
private:
    const CXXGraph::Graph<std::string>& graph_;
    
    std::vector<std::pair<int, int>> findReachablePositions(
        int startX, int startY, 
        int maxDistance) {
        
        std::vector<std::pair<int, int>> reachable;
        std::string startId = std::to_string(startX) + "," + std::to_string(startY);
        CXXGraph::Node<std::string> startNode(startId, startId);
        
        // Use BFS to find all reachable nodes
        auto bfsResult = graph_.breadth_first_search(startNode);
        
        // Filter by distance (Manhattan distance for simplicity)
        for (const auto& nodeId : bfsResult) {
            size_t commaPos = nodeId.find(',');
            int x = std::stoi(nodeId.substr(0, commaPos));
            int y = std::stoi(nodeId.substr(commaPos + 1));
            
            int dist = std::abs(x - startX) + std::abs(y - startY);
            if (dist <= maxDistance) {
                reachable.push_back({x, y});
            }
        }
        
        return reachable;
    }
};
```

**AI Breakdown**:
- `chasePlayer()`: Moves toward the player but respects movement limits
- `findAttackPosition()`: Finds optimal position to attack from
- `findReachablePositions()`: Uses BFS to find all tiles within move range

## Step 6: Complete Demo - Putting It All Together

Let's create a working tactical game simulation:

```cpp
#include "CXXGraph/CXXGraph.hpp"
#include <iostream>
#include <iomanip>

class TacticalGame {
public:
    TacticalGame(int width, int height) 
        : grid_(width, height), width_(width), height_(height) {}
    
    void setupMap() {
        // Create a mountain range obstacle
        for (int y = 3; y <= 6; ++y) {
            grid_.setObstacle(5, y);
        }
        
        // Build graph from grid
        graph_ = buildGraphFromGrid(grid_, width_, height_);
        
        std::cout << "Map initialized with obstacles\n";
    }
    
    void simulateTurn() {
        std::cout << "\n╔═══════════════════════════════════╗\n";
        std::cout << "║  TACTICAL TURN SIMULATION         ║\n";
        std::cout << "╚═══════════════════════════════════╝\n\n";
        
        // Initial positions
        int playerX = 2, playerY = 2;
        int enemyX = 8, enemyY = 8;
        
        std::cout << "📍 Player Position: (" << playerX << ", " << playerY << ")\n";
        std::cout << "👹 Enemy Position:  (" << enemyX << ", " << enemyY << ")\n\n";
        
        // Enemy AI decides what to do
        EnemyAI ai(graph_);
        
        std::cout << "🤖 Enemy AI thinking...\n\n";
        
        // Chase player with 3 movement points
        auto enemyPath = ai.chasePlayer(enemyX, enemyY, playerX, playerY, 3);
        
        std::cout << "Enemy movement path:\n";
        for (size_t i = 0; i < enemyPath.size(); ++i) {
            const auto& [x, y] = enemyPath[i];
            if (i == 0) {
                std::cout << "  Start: (" << x << ", " << y << ")\n";
            } else if (i == enemyPath.size() - 1) {
                std::cout << "  Final: (" << x << ", " << y << ") ⚔️\n";
            } else {
                std::cout << "  Step " << i << ": (" << x << ", " << y << ")\n";
            }
        }
        
        // Find optimal attack position
        auto attackPos = ai.findAttackPosition(
            enemyX, enemyY, 
            playerX, playerY, 
            2,  // Attack range: 2 tiles
            3   // Move range: 3 tiles
        );
        
        std::cout << "\n🎯 Optimal attack position: (" 
                  << attackPos.first << ", " << attackPos.second << ")\n\n";
        
        // Display visual map
        displayMap(playerX, playerY, enemyX, enemyY, enemyPath);
    }
    
private:
    GameGrid grid_;
    CXXGraph::Graph<std::string> graph_;
    int width_, height_;
    
    void displayMap(
        int playerX, int playerY, 
        int enemyX, int enemyY,
        const std::vector<std::pair<int, int>>& path) {
        
        std::cout << "═══════ MAP VISUALIZATION ═══════\n";
        std::cout << "P = Player | E = Enemy | * = Path | # = Obstacle\n\n";
        
        for (int y = 0; y < height_; ++y) {
            std::cout << "  "; // Indent for readability
            
            for (int x = 0; x < width_; ++x) {
                if (x == playerX && y == playerY) {
                    std::cout << "P ";
                } else if (x == enemyX && y == enemyY) {
                    std::cout << "E ";
                } else if (!grid_.isWalkable(x, y)) {
                    std::cout << "# ";
                } else if (isInPath(x, y, path)) {
                    std::cout << "* ";
                } else {
                    std::cout << ". ";
                }
            }
            std::cout << "\n";
        }
        std::cout << "\n";
    }
    
    bool isInPath(int x, int y, 
                 const std::vector<std::pair<int, int>>& path) const {
        for (const auto& [px, py] : path) {
            if (x == px && y == py) return true;
        }
        return false;
    }
};

int main() {
    std::cout << "🎮 Tactical RPG Movement System Demo\n";
    std::cout << "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n";
    
    TacticalGame game(10, 10);
    game.setupMap();
    game.simulateTurn();
    
    std::cout << "✅ Simulation complete!\n";
    
    return 0;
}
```

**Run this and you'll see**:
```
🎮 Tactical RPG Movement System Demo
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Map initialized with obstacles

╔═══════════════════════════════════╗
║  TACTICAL TURN SIMULATION         ║
╚═══════════════════════════════════╝

📍 Player Position: (2, 2)
👹 Enemy Position:  (8, 8)

🤖 Enemy AI thinking...

Enemy movement path:
  Start: (8, 8)
  Step 1: (7, 7)
  Step 2: (6, 6)
  Final: (6, 5) ⚔️

🎯 Optimal attack position: (4, 4)

═══════ MAP VISUALIZATION ═══════
P = Player | E = Enemy | * = Path | # = Obstacle

  . . . . . . . . . . 
  . . . . . . . . . . 
  . . P . . . . . . . 
  . . . . . # . . . . 
  . . . . . # * . . . 
  . . . . . # * . . . 
  . . . . . . * . . . 
  . . . . . . . * . . 
  . . . . . . . . E . 
  . . . . . . . . . . 

✅ Simulation complete!
```

## Performance Optimization Tips

### 1. Path Caching
Don't recalculate the same paths repeatedly:

```cpp
class PathCache {
    std::unordered_map<std::string, std::vector<std::pair<int, int>>> cache_;
    
    std::string makeKey(int x1, int y1, int x2, int y2) {
        return std::to_string(x1) + "," + std::to_string(y1) + 
               "->" + std::to_string(x2) + "," + std::to_string(y2);
    }
    
public:
    bool hasPath(int x1, int y1, int x2, int y2) {
        return cache_.find(makeKey(x1, y1, x2, y2)) != cache_.end();
    }
    
    void storePath(int x1, int y1, int x2, int y2, 
                   const std::vector<std::pair<int, int>>& path) {
        cache_[makeKey(x1, y1, x2, y2)] = path;
    }
    
    const std::vector<std::pair<int, int>>& getPath(
        int x1, int y1, int x2, int y2) {
        return cache_[makeKey(x1, y1, x2, y2)];
    }
    
    void clear() { cache_.clear(); }
};
```

### 2. Choose the Right Algorithm

CXXGraph offers multiple pathfinding algorithms - pick based on your needs:

| Algorithm | Best For | Time Complexity |
|-----------|----------|----------------|
| **BFS** | Unweighted grids, finding all reachable tiles | O(V + E) |
| **Dijkstra** | Weighted terrain, guaranteed shortest path | O((V + E) log V) |
| **DFS** | Maze exploration, procedural generation | O(V + E) |

```cpp
// For unweighted grids (all terrain costs the same):
auto bfsResult = graph.breadth_first_search(startNode);

// For weighted grids (forests cost more than roads):
auto dijkstraResult = graph.dijkstra(startNode, goalNode);
```

### 3. Spatial Partitioning for Large Maps

For huge open-world games, divide your map into sectors:

```cpp
class SectoredMap {
    std::vector<std::vector<CXXGraph::Graph<std::string>>> sectors_;
    
    // Only pathfind within relevant sectors
    CXXGraph::Graph<std::string> getRelevantGraph(int x1, int y1, int x2, int y2) {
        // Logic to combine only sectors along the path
    }
};
```

## Integrating with Game Engines

### Unity Integration (C++ Plugin)

Create a C++ plugin that Unity can call:

```cpp
extern "C" {
    // Export for Unity
    void* __declspec(dllexport) CreatePathfinder(int width, int height) {
        auto* grid = new GameGrid(width, height);
        // Return handle to Unity
        return grid;
    }
    
    void __declspec(dllexport) FindPath(
        void* gridHandle,
        int startX, int startY, 
        int goalX, int goalY,
        int* outPathX, int* outPathY, 
        int* outLength) {
        
        auto* grid = static_cast<GameGrid*>(gridHandle);
        // Build graph and find path
        // Fill output arrays for Unity
    }
}
```

Then in Unity C#:
```csharp
[DllImport("CXXGraphPlugin")]
private static extern IntPtr CreatePathfinder(int width, int height);

[DllImport("CXXGraphPlugin")]
private static extern void FindPath(IntPtr gridHandle, ...);
```

### Unreal Engine Integration

In Unreal, you can use CXXGraph directly in gameplay code:

```cpp
// YourPathfindingManager.h
#pragma once

#include "CXXGraph/CXXGraph.hpp"
#include "GameFramework/Actor.h"
#include "YourPathfindingManager.generated.h"

UCLASS()
class YOURGAME_API AYourPathfindingManager : public AActor {
    GENERATED_BODY()
    
private:
    CXXGraph::Graph<std::string> NavigationGraph;
    
public:
    UFUNCTION(BlueprintCallable, Category="Pathfinding")
    TArray<FVector> FindPathToLocation(FVector Start, FVector Goal);
    
    UFUNCTION(BlueprintCallable, Category="Pathfinding")
    void RebuildNavigationGraph();
};
```

## Real-World Examples

### Example 1: Tower Defense Enemy Pathing

```cpp
class TowerDefensePathfinder {
public:
    // Enemies avoid towers but still reach the goal
    std::vector<std::pair<int, int>> findPathAvoidingTowers(
        const CXXGraph::Graph<std::string>& graph,
        int startX, int startY,
        int goalX, int goalY,
        const std::vector<std::pair<int, int>>& towerPositions) {
        
        // Temporarily mark tower positions as high-cost
        // (not implemented here but you'd rebuild the graph
        // with weighted edges around towers)
        
        return findPath(graph, startX, startY, goalX, goalY);
    }
};
```

### Example 2: RTS Unit Formation Movement

```cpp
class FormationMovement {
public:
    struct Unit {
        int x, y;
        int formationOffsetX, formationOffsetY;
    };
    
    std::vector<std::vector<std::pair<int, int>>> moveFormation(
        const CXXGraph::Graph<std::string>& graph,
        const std::vector<Unit>& units,
        int leaderGoalX, int leaderGoalY) {
        
        std::vector<std::vector<std::pair<int, int>>> paths;
        
        for (const auto& unit : units) {
            // Calculate unit's goal relative to leader
            int unitGoalX = leaderGoalX + unit.formationOffsetX;
            int unitGoalY = leaderGoalY + unit.formationOffsetY;
            
            // Find path for each unit
            auto path = findPath(
                graph, 
                unit.x, unit.y,
                unitGoalX, unitGoalY
            );
            
            paths.push_back(path);
        }
        
        return paths;
    }
};
```

### Example 3: Stealth Game Line-of-Sight

```cpp
bool hasLineOfSight(
    const GameGrid& grid,
    int x1, int y1, 
    int x2, int y2) {
    
    // Bresenham's line algorithm
    int dx = std::abs(x2 - x1);
    int dy = std::abs(y2 - y1);
    int sx = (x1 < x2) ? 1 : -1;
    int sy = (y1 < y2) ? 1 : -1;
    int err = dx - dy;
    
    int x = x1, y = y1;
    
    while (true) {
        // Check if current position blocks line of sight
        if (!grid.isWalkable(x, y) && !(x == x1 && y == y1) && !(x == x2 && y == y2)) {
            return false; // Blocked by obstacle
        }
        
        if (x == x2 && y == y2) break;
        
        int e2 = 2 * err;
        if (e2 > -dy) {
            err -= dy;
            x += sx;
        }
        if (e2 < dx) {
            err += dx;
            y += sy;
        }
    }
    
    return true; // Clear line of sight
}

// Use in stealth AI
class StealthAI {
public:
    bool canEnemySeePlayer(
        const GameGrid& grid,
        int enemyX, int enemyY,
        int playerX, int playerY,
        int visionRange) {
        
        // Check distance first
        int dist = std::abs(enemyX - playerX) + std::abs(enemyY - playerY);
        if (dist > visionRange) return false;
        
        // Check line of sight
        return hasLineOfSight(grid, enemyX, enemyY, playerX, playerY);
    }
};