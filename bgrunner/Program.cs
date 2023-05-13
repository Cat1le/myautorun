using System.Diagnostics;

Console.WriteLine("Starting: " + String.Join(" ", args));
String arguments = String.Join(" ", args.Skip(1).ToArray());
String command = args[0];

var p = new Process();
p.StartInfo = new ProcessStartInfo(command);
p.StartInfo.Arguments = arguments;
p.StartInfo.WorkingDirectory = Path.GetDirectoryName(command);
p.StartInfo.CreateNoWindow = true;
p.StartInfo.UseShellExecute = false;
p.Start();