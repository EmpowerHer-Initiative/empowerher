# Agency Template — Client Starter

## New Project Setup

### Cloudflare R2 — CORS Policy

When creating a new R2 bucket, apply this CORS policy:

```json
[
  {
    "AllowedOrigins": ["http://localhost:3000"],
    "AllowedMethods": ["GET", "PUT"],
    "AllowedHeaders": ["Content-Type", "*"]
  }
]
```

> Add production domain to `AllowedOrigins` before deploying.

### AWS SES — IAM Policy

When creating a new IAM user for SES email sending, attach this policy:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "SendEmailOnly",
      "Effect": "Allow",
      "Action": ["ses:SendEmail", "ses:SendRawEmail"],
      "Resource": [
        "arn:aws:ses:us-west-2:135808932294:identity/alisamadii.com",
        "arn:aws:ses:us-west-2:135808932294:configuration-set/my-first-configuration-set"
      ]
    }
  ]
}
```

> Replace `alisamadii.com` with client domain. Update region if different from `us-west-2`.
