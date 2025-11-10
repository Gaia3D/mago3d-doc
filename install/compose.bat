@echo off
setlocal enabledelayedexpansion

REM Set the default env-file
set ENV_FILE=.env.compose
set COMMAND=
set COMMAND_ARGS=

REM Parse the command line options
:parse_args
if "%~1"=="" goto check_command
if "%~1"=="-h" goto print_usage
if "%~1"=="--help" goto print_usage
if "%~1"=="--env-file" (
    if "%~2"=="" (
        call :print_error "--env-file value is required"
        goto print_usage
    )
    set ENV_FILE=%~2
    shift
    shift
    goto parse_args
)
if "%~1"=="config" goto set_command
if "%~1"=="build" goto set_command
if "%~1"=="push" goto set_command
if "%~1"=="up" goto set_command
if "%~1"=="down" goto set_command
if "%~1"=="ps" goto set_command
if "%~1"=="logs" goto set_command
set COMMAND_ARGS=!COMMAND_ARGS! %~1
shift
goto parse_args

:set_command
set COMMAND=%~1
shift
:collect_args
if "%~1"=="" goto check_command
set COMMAND_ARGS=!COMMAND_ARGS! %~1
shift
goto collect_args

:check_command
if "%COMMAND%"=="" (
    call :print_error "command is required"
    goto print_usage
)

REM Check the env-file exists
if not exist "%ENV_FILE%" (
    call :print_error "File %ENV_FILE% not found"
    goto print_usage
)

REM Run the command
if "%COMMAND%"=="build" goto cmd_build
if "%COMMAND%"=="push" goto cmd_push
if "%COMMAND%"=="config" goto cmd_compose
if "%COMMAND%"=="up" goto cmd_compose
if "%COMMAND%"=="down" goto cmd_compose
if "%COMMAND%"=="ps" goto cmd_compose
if "%COMMAND%"=="logs" goto cmd_compose
call :print_error "Unknown command: %COMMAND%"
goto print_usage

:cmd_build
set BASE_DIR=%~dp0
set PROJECT_ROOT=%BASE_DIR%..\..
cd /d "%PROJECT_ROOT%"
echo gradlew.bat %COMMAND_ARGS% jibDockerBuild
goto :eof

:cmd_push
set BASE_DIR=%~dp0
set PROJECT_ROOT=%BASE_DIR%..\..
cd /d "%PROJECT_ROOT%"
gradlew.bat %COMMAND_ARGS% jib
goto :eof

:cmd_compose
docker compose --env-file "%ENV_FILE%" -f docker-compose.base.yml -f docker-compose.compose.yml %COMMAND% %COMMAND_ARGS%
goto :eof

:print_usage
echo Usage: %~n0 [options] command [command args]
echo Options:
echo   --env-file ^<path^>   : Specify an environment file. (default: .env-compose)
echo   -h, --help          : Print this message.
echo.
echo Commands:
echo   config              : Outputs the final config file, after doing merges and interpolations.
echo   build               : Build or rebuild services.
echo   push                : Push service images.
echo   up                  : Create and start containers.
echo   down                : Stop and remove containers.
echo   ps                  : List containers.
echo   logs                : View output from containers.
echo.
echo Examples:
echo   %~n0 up -d
echo   %~n0 --env-file .env up -d --build
exit /b 1

:print_error
echo [31m%~1[0m
exit /b 0
