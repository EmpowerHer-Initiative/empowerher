# AWS SES — New Client Setup

## 1. Create IAM User

1. Go to **IAM → Users → Create user**
2. Name: `client-empowerher`
3. No console access needed

## 2. Attach Inline Policy

**Users → {user} → Add permissions → Create inline policy → JSON tab**

- **Policy name:** `SES-SendOnly-empowerher` (e.g. `SES-SendOnly-acme`)
- **Description:** `Allow sending emails from {clientdomain.com} only`

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "SendEmailOnly",
      "Effect": "Allow",
      "Action": "ses:SendEmail",
      "Resource": [
        "arn:aws:ses:us-east-1:135808972294:identity/empowerher-initiative.org",
        "arn:aws:ses:us-east-1:135808972294:configuration-set/my-first-configuration-set"
      ]
    }
  ]
}
```

Replace `empowerher-initiative.org` with the client's domain. The configuration set resource is required because SES checks permission on both the identity and any assigned configuration set.

## 3. Create Access Key

1. **Users → {user} → Security credentials → Create access key**
2. Select **Application running outside AWS**
3. Copy `Access Key ID` and `Secret Access Key`

## 4. Add to Client `.env`

```env
AWS_BUCKET_ORIGIN=us-east-1
AWS_ACCESS_KEY_VALUE=AKIA...
AWS_SECRET_KEY_VALUE=...
```

## 5. Verify Client Domain in SES

1. **SES → Identities → Create identity**
2. Select **Domain**, enter `clientdomain.com`
3. Add the DNS records (DKIM CNAME + verification TXT) to client's DNS
4. Wait for verification (usually minutes, up to 72h)

## Admin Policy (your account only)

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "SESAdmin",
      "Effect": "Allow",
      "Action": [
        "ses:SendEmail",
        "ses:GetAccountSendingEnabled",
        "ses:GetSendQuota",
        "ses:GetSendStatistics",
        "ses:ListIdentities",
        "ses:GetIdentityVerificationAttributes",
        "ses:GetIdentityDkimAttributes"
      ],
      "Resource": "*"
    }
  ]
}
```
