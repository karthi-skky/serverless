### Instructions 

# AWS Setup

You'll need an Amazon Web Services account and credentials set up on your development machine. If you haven't done it before, here's a useful guide for [Configuring the AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-configure.html).

[Configure AWS credentials](https://serverless.com/framework/docs/providers/aws/guide/credentials/) to use with serverless framework.

Setup RDS instance with the proper security groups. Two databases should be created under one instance - dev and production. 

# Deployment

Create configuration file under project root `./config/config.json`. This file is not commited to the source repository for security reasons. Here is the file content:

```javascript
    {
      "region": "us-west-2",
      "JWT_SECRET": "VERY_LONG_RANDOM_STRING", 
      "JWT_ADMIN_SECRET": "VERY_LONG_RANDOM_STRING_AND_DIFERENT_THAN_USER_SECRET", 
      "SESSION_TTL_SECONDS": 360000,
      "RESET_SESSION_TTL": 300,
      "DELETE_WARNING_SCHEDULE_DAYS": 27, 
      "DELETE_SCHEDULE_DAYS": 30,
      "USER_PROFILE_IMAGES_BUCKET": "BUCKET_TO_STORE_PROFILE_IMAGES",
      "db": {
          "host": "RDS_HOST",
          "port": 5432,
          "prod": "production",
          "dev": "dev",
          "user": "MASTERUSER",
          "password": "STRONG_PASSWORD"
      },
      "MAIL": {
          "host": "email-smtp.us-west-2.amazonaws.com", 
          "post": 465,
          "secure": true,
          "auth": {
          "user": "SES_GENERATED_USER",
          "pass": "SES_GENERATED_PASSWORD"
        },
        "domain": "YOUR_EMAIL_DOMAIN i.e. example.com" 
      },
      "SENDER_EMAIL": "YOUR_EMAIL"
    }
```

- Install [NodeJS](https://nodejs.org) version 8.x as lambda currently supports that version. 
- Install serverless framework using `npm i -g serverless`
- run `npm i` inside project root folder
- run `serverless deploy --stage dev --aws-profile your_configured_aws_profile_name --region us-west-2`

# API Gateway limitation and setup

AWS recently added support for multipart-form upload on lambda. Due to some limitations there is a one-time manual step to be done after first deploy on the new environment. Go to API gateway -> select [stage]-icbaazzar-aws-rest-> Settings -> Under binary media types section add `multipart/form-data`. This is required for upload inventories.  


Note that stage can be `prod` and region can be any existing AWS region. API's deployed on dev environment will use dev database while API's deployed on production environment will use production database. Database names are set in the config file under keys dev and prod. 

# admin setup

Since passwords in database are encrypted, it is impossible to enter password manually. On inital setup call POST admin/create endpoint with email_address and password in the body. If there is no admin new record with given credentials will be created. If admin exists no additional records will be created neither existing will be changed. If you need new credentials, delete admin user and call the API again. 

# TESTS

To run tests enter `npm run tests`. 

# How to handle SES bounces

Deploy serverless service. Lambda function, SQS queue, SNS Topic and subscription will be created. Go to SES service and update configuration to connect Bounce Notifications SNS Topic:	
with newly created topic named `EmailBouncesTopic`. Instructions how to do that can be found [here](

Create user with email `bounce@simulator.amazonses.com`. Amazon SES includes a mailbox simulator that you can use to test how your application handles different email sending scenarios. Send test email to `bounce@simulator.amazonses.com` using AWS SES Console in order to test handling bounced email. 