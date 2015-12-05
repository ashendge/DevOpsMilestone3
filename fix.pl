#!/usr/bin/perl

use strict;

sub parse () {
	my $cmd = "top -b -n1";
	my $count = 0;
	my $log_file = "application.log";
	
	my @output = `$cmd`;
	my $total = @output;
	foreach my $line (@output) {
		if ($line =~ m/\s*PID\s+USER/) {
			my $i = 0;
			for ($i = $count + 1; $i < $count + 6; $i++) {
				my @tokens = split(/\s+/, $output[$i]);

				my $cpu_usage;
				my $process_id;
				my $process_name;
				my $user;

				my $cpu_usage = sprintf("%.2f", $tokens[8]);
				if ($tokens[0] eq "") {
					$user = $tokens[2];
					$cpu_usage = $tokens[9];
					$process_id = $tokens[1];
					$process_name = $tokens[12];

				} else {
					$user = $tokens[1];
					$cpu_usage = $tokens[8];
					$process_id = $tokens[0];
					$process_name = $tokens[11];
				}
				
				if ($cpu_usage > 40) {
					if ($user eq "root") {
						print "Too much CPU Usage: $process_name. Not terminating without root user login\n";
						open (LOGFILE, ">>$log_file");
						my $date = `date`;
						chomp($date);
						print LOGFILE "[$date]:Root process \"$process_name\" using excess CPU. Not terminating without root user login";
						close(LOGFILE);
					} else {
						print "Too much CPU Usage: $process_name\n";
						system ("kill -9 $process_id");
						open (LOGFILE, ">>$log_file");
						my $date = `date`;
						chomp($date);
						print LOGFILE "[$date]:Excess CPU Process killed - $process_name by user \"$user\"\n";
						close (LOGFILE);
					}
				}
			}
		}
		$count = $count + 1;
	}
}

parse();
