@echo off
echo Building BgRunner.exe...
cd bgrunner
dotnet publish -c Release
cd ..
move .\bgrunner\bin\release\net7.0\win-x64\publish\BgRunner.exe .
echo Building client...
cd client
npm i
npm run build
echo Done.