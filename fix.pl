#!/usr/bin/perl

use strict;

sub parse () {
	my $cmd = "top -b -n1";
	my $count = 0;
	
	my @output = `$cmd`;
	my $total = @output;
	print "Top output:\n";
	foreach my $line (@output) {

		if ($line =~ m/\s*PID\s+USER/) {
			print "Parsed: $line\n";
			my $i = 0;
			for ($i = $count + 1; $i < $count + 6; $i++) {
				print "Parsing: $output[$i]";
				my @tokens = split(/\s+/, $output[$i]);

				my $cpu_usage;
				my $process_id;
				my $process_name;

				my $cpu_usage = sprintf("%.2f", $tokens[8]);
				if ($tokens[0] eq "") {
					#print "NOTHING!!\n";
					print "Process ID: $tokens[1]\nCPU Usage: $tokens[9] -> $cpu_usage\n";
					print "Process Name: $tokens[12]\n";

					$cpu_usage = $tokens[9];
					$process_id = $tokens[1];
					$process_name = $tokens[12];

				} else {
					print "Process ID: $tokens[0]\nCPU Usage: $tokens[8] -> $cpu_usage\n";
					print "Process Name: $tokens[11]\n";

					$cpu_usage = $tokens[8];
					$process_id = $tokens[0];
					$process_name = $tokens[11];

				}
				foreach my $tok (@tokens) {
					#print "$tok\n";
				}
				if ($cpu_usage > 60) {
					printf "TOO MUCH USAGE: $tokens[$1]\n";
					system ("kill -9 $process_id");
				}
				print "-----\n";
			}
		}

		$count = $count + 1;
	}

}

parse();
