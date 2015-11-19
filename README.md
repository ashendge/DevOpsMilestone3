# CSC DevOps Milestone 3: Deployment

##Team members
##### Anurag Sadanand Shendge 
##### Aneesh Kher  
##### Krishna Teja Dinavahi 


#### Tools and Services Used:
 * Amazon Web Services to provision remote machines running Ubuntu OS.   
 * Jenkins Continous Integration tool to automatically start build on each new change to the repository
 * Twilio Service for sending SMS alerts . 
 * Git / Git webhooks

 
##### The application used for this milestone is borrowed from homework 3 where one can navigate to different resources on appropriate URLs

## Properties of the deployment pipeline covered in the milestone

#####  1. Automatically configure production environment using Ansible.
    In this step, we used automatically configured the production environment and canary later in the milestones (AWS 
    instances) using the Node js script and Amazon API. We used Ansible playbook to which installed the necessary software 
    packages. A thing however to note here is that we did not install the application specific dependencies as those will be
    installed during the deployment phase.

#####  2. Ability to deploy application to the production environment after the build passes.
     The build is triggered on a git push for our application. So the common use case of our pipeline would be when a 
     developer pushes his/her code change to the Github, the webhook will trigger a build in Jenkins which is running on a 
     seperate AWS instance acting as our build server.
#####  3. Ability to turn on or off a feature using the feature flags. We used a remote (global) redis key-value store the flag
  
#####  4. Ability to monitor the deployed application and raise alerts based on CPU usage and Memory usage criteria.

##### 5. Ability to perform the canary release and route a percentage (33%) of traffic to the newly staged application.

##### 6. Ability to stop routing traffic to canary if an alert is raised on the canary machine.





