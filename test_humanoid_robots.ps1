# Humanoid Robot Simulator - Windows PowerShell Test Script

param(
    [string]$BaseUrl = "http://localhost:5000",
    [switch]$Help
)

# Display help information
if ($Help) {
    Write-Host "🧪 Humanoid Robot Simulator - Windows Test Script" -ForegroundColor Cyan
    Write-Host "=================================================" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Usage:" -ForegroundColor Yellow
    Write-Host "  .\test_humanoid_robots.ps1" -ForegroundColor White
    Write-Host "  .\test_humanoid_robots.ps1 -BaseUrl http://localhost:8080" -ForegroundColor White
    Write-Host "  .\test_humanoid_robots.ps1 -Help" -ForegroundColor White
    Write-Host ""
    Write-Host "Parameters:" -ForegroundColor Yellow
    Write-Host "  -BaseUrl  API base URL (default: http://localhost:5000)" -ForegroundColor White
    Write-Host "  -Help     Show this help message" -ForegroundColor White
    Write-Host ""
    exit 0
}

# Function to make API requests with error handling
function Invoke-ApiRequest {
    param(
        [string]$Uri,
        [string]$Method = "GET",
        [hashtable]$Body = $null,
        [int]$TimeoutSec = 5
    )
    
    try {
        $params = @{
            Uri = $Uri
            Method = $Method
            TimeoutSec = $TimeoutSec
        }
        
        if ($Body) {
            $params.Body = ($Body | ConvertTo-Json)
            $params.ContentType = "application/json"
        }
        
        $response = Invoke-RestMethod @params
        return @{ Success = $true; Data = $response }
    }
    catch {
        return @{ Success = $false; Error = $_.Exception.Message }
    }
}

# Main test function
function Test-HumanoidRobots {
    Write-Host "🤖 Testing Humanoid Robot Simulator" -ForegroundColor Cyan
    Write-Host "====================================" -ForegroundColor Cyan
    Write-Host ""
    
    $testsPassed = 0
    $totalTests = 6
    
    try {
        # Test 1: API Information
        Write-Host "1. 🏠 API Information..." -ForegroundColor Yellow
        $result = Invoke-ApiRequest -Uri "$BaseUrl/"
        
        if ($result.Success) {
            $data = $result.Data
            Write-Host "   ✅ $($data.message)" -ForegroundColor Green
            Write-Host "   ✅ Robot Count: $($data.robot_count)" -ForegroundColor Green
            Write-Host "   ✅ Robots: $($data.robots -join ', ')" -ForegroundColor Green
            Write-Host "   ✅ Actions: $($data.available_actions.Count) available" -ForegroundColor Green
            $testsPassed++
        } else {
            Write-Host "   ❌ Failed: $($result.Error)" -ForegroundColor Red
        }
        
        # Test 2: Robot Status
        Write-Host "`n2. 📊 All Robots Status..." -ForegroundColor Yellow
        $result = Invoke-ApiRequest -Uri "$BaseUrl/status/all"
        
        if ($result.Success -and $result.Data.success) {
            $data = $result.Data.data
            foreach ($robotId in $data.PSObject.Properties.Name) {
                $status = $data.$robotId
                $pos = $status.position
                Write-Host "   🤖 ${robotId}: $($status.current_action) at ($([math]::Round($pos.x)), $([math]::Round($pos.y)))" -ForegroundColor Green
            }
            $testsPassed++
        } else {
            Write-Host "   ❌ Failed to get robot status" -ForegroundColor Red
        }
        
        # Test 3: Individual Robot Control
        Write-Host "`n3. 🎮 Individual Robot Tests..." -ForegroundColor Yellow
        $robotTests = @(
            @{ Robot = "robot_1"; Action = "wave" },
            @{ Robot = "robot_2"; Action = "bow" },
            @{ Robot = "robot_3"; Action = "right_kick" },
            @{ Robot = "robot_4"; Action = "kung_fu" },
            @{ Robot = "robot_5"; Action = "go_forward" },
            @{ Robot = "robot_6"; Action = "turn_right" }
        )
        
        $individualSuccess = 0
        foreach ($test in $robotTests) {
            $body = @{
                method = "RunAction"
                action = $test.Action
                robot = $test.Robot
            }
            
            $result = Invoke-ApiRequest -Uri "$BaseUrl/run_action/$($test.Robot)" -Method "POST" -Body $body
            
            if ($result.Success -and $result.Data.results[0].success) {
                Write-Host "   ✅ $($test.Robot): $($test.Action)" -ForegroundColor Green
                $individualSuccess++
            } else {
                Write-Host "   ❌ $($test.Robot): Failed" -ForegroundColor Red
            }
            
            Start-Sleep -Milliseconds 200
        }
        
        if ($individualSuccess -eq $robotTests.Count) {
            $testsPassed++
        }
        
        # Test 4: All Robots Together
        Write-Host "`n4. 👥 All Robots Wave..." -ForegroundColor Yellow
        $body = @{
            method = "RunAction"
            action = "wave"
            robot = "all"
        }
        
        $result = Invoke-ApiRequest -Uri "$BaseUrl/run_action/all" -Method "POST" -Body $body
        
        if ($result.Success) {
            $successful = ($result.Data.results | Where-Object { $_.success }).Count
            Write-Host "   ✅ Wave started on $successful/6 robots" -ForegroundColor Green
            $testsPassed++
        } else {
            Write-Host "   ❌ Failed to start wave on all robots" -ForegroundColor Red
        }
        
        # Test 5: Check Status During Action
        Write-Host "`n5. 📊 Status During Wave..." -ForegroundColor Yellow
        Start-Sleep -Seconds 1
        
        $result = Invoke-ApiRequest -Uri "$BaseUrl/status/all"
        
        if ($result.Success -and $result.Data.success) {
            $waving = 0
            foreach ($robotId in $result.Data.data.PSObject.Properties.Name) {
                $status = $result.Data.data.$robotId
                if ($status.current_action -eq "wave") {
                    $waving++
                }
            }
            Write-Host "   👋 Robots waving: $waving/6" -ForegroundColor Green
            $testsPassed++
        } else {
            Write-Host "   ❌ Failed to check status during action" -ForegroundColor Red
        }
        
        # Test 6: Stop All
        Write-Host "`n6. 🛑 Stop All Robots..." -ForegroundColor Yellow
        $body = @{
            method = "StopAction"
            action = "stop"
            robot = "all"
        }
        
        $result = Invoke-ApiRequest -Uri "$BaseUrl/run_action/all" -Method "POST" -Body $body
        
        if ($result.Success) {
            $stopped = ($result.Data.results | Where-Object { $_.success }).Count
            Write-Host "   ✅ Stopped $stopped/6 robots" -ForegroundColor Green
            $testsPassed++
        } else {
            Write-Host "   ❌ Failed to stop all robots" -ForegroundColor Red
        }
        
        # Test Results
        Write-Host "`n" + "="*50 -ForegroundColor Cyan
        if ($testsPassed -eq $totalTests) {
            Write-Host "🎉 Humanoid Robot Simulator: ALL TESTS PASSED!" -ForegroundColor Green
        } else {
            Write-Host "⚠️  Humanoid Robot Simulator: $testsPassed/$totalTests tests passed" -ForegroundColor Yellow
        }
        
        Write-Host "`n📚 Usage Examples:" -ForegroundColor Yellow
        Write-Host "# Individual robot control:" -ForegroundColor Gray
        Write-Host "Invoke-RestMethod -Uri '$BaseUrl/run_action/robot_1' ``" -ForegroundColor White
        Write-Host "  -Method Post -ContentType 'application/json' ``" -ForegroundColor White
        Write-Host "  -Body '{`"method`":`"RunAction`",`"action`":`"wave`"}'" -ForegroundColor White
        Write-Host ""
        Write-Host "# All robots control:" -ForegroundColor Gray
        Write-Host "Invoke-RestMethod -Uri '$BaseUrl/run_action/all' ``" -ForegroundColor White
        Write-Host "  -Method Post -ContentType 'application/json' ``" -ForegroundColor White
        Write-Host "  -Body '{`"method`":`"RunAction`",`"action`":`"bow`"}'" -ForegroundColor White
        Write-Host ""
        Write-Host "# Get status:" -ForegroundColor Gray
        Write-Host "Invoke-RestMethod -Uri '$BaseUrl/status/all'" -ForegroundColor White
        
        return $testsPassed -eq $totalTests
        
    } catch {
        Write-Host "❌ Cannot connect to humanoid robot simulator" -ForegroundColor Red
        Write-Host "   Make sure the simulator is running at $BaseUrl" -ForegroundColor Yellow
        Write-Host "   Run: .\run_simulator.ps1" -ForegroundColor Yellow
        return $false
    }
}

# Run the tests
$success = Test-HumanoidRobots

if ($success) {
    exit 0
} else {
    exit 1
}
