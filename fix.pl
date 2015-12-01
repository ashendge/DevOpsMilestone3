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

				my $cpu_usage = sprintf("%.2f", $tokens[8]);
				if ($tokens[0] eq "") {
					$cpu_usage = $tokens[9];
					$process_id = $tokens[1];
					$process_name = $tokens[12];

				} else {
					$cpu_usage = $tokens[8];
					$process_id = $tokens[0];
					$process_name = $tokens[11];
				}
				
				if ($cpu_usage > 40) {
					printf "TOO MUCH USAGE: $tokens[$1]\n";
					system ("kill -9 $process_id");
					open (LOGFILE, ">>$log_file");
					my $date = `date`;
					chomp($date);
					print LOGFILE "[$date]:Excess CPU Process killed - $process_name\n";
					close (LOGFILE);
				}
			}
		}
		$count = $count + 1;
	}
}

parse();
