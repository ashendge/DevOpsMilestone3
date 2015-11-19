# CSC DevOps Milestone 3: Deployment

##Team members
> ##### Anurag Sadanand Shendge (ashendg)
> ##### Aneesh Kher  (aakher)
> ##### Krishna Teja Dinavahi (kdinava)


#### Tools and Services Used:
 * Ansible
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
#####  3. Ability to turn on or off a feature using the feature flags. We used a remote (global) redis key-value store the flag.

    We used a redis key-value sever as a global store to maintain the feature flag. The feature canbe manually overriden 
    as and when the developement team would like to enable the hidden features into prodcution environment without 
    triggering a new build. 
#####  4. Ability to monitor the deployed application and raise alerts based on CPU usage and Memory usage criteria.

    We are using Twilio service to send the SMS when an alert is raised. Twilio has extended their API for Node.js such that
    we could oncorporate it in our application. We are monotoring CPU usage and triggering an alert as soon as the 
    monotoring code detects a spike in the CPU usage value above 60%. As a second metric, we are also keeping track of the 
    memory usage. We are triggering the alert on a threshold of 90% memory usage.

##### 5. Ability to perform the canary release and route a percentage (33%) of traffic to the newly staged application.

    We are using a proxy server which handles the routing of incoming requests to Production( 66% ) and Canary ( 33% ). We 
    can access our app on the proxy server URL on port 8080. We have dofferentiated the reuqests by displaying Production 
    and Canary messages according to where the reuqest is served from.

##### 6. Ability to stop routing traffic to canary if an alert is raised on the canary machine.

    As soon as we receive an alert from Canary due to a failure, we stop routing 33% traffic to Canary instance and redirect
    all the traffic back to production server. We can do this with the help of setting a redis flag which is turned off as 
    soon as a canary alert is raised.


#Screencast   
###(Click the image below  and you will be redirected to YouTube)
[![IMAGE ALT TEXT HERE](http://img.youtube.com/vi/ChKLYoqEgw0/0.jpg)](https://youtu.be/ChKLYoqEgw0)




