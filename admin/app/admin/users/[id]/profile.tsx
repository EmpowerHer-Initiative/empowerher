import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Devices } from "@/components/admin/users/devices";
import { EmailAddresses } from "@/components/admin/users/email-addresses";
import { Password } from "@/components/admin/users/password";
import { PersonalInformation } from "@/components/admin/users/personal-information";
import { SocialAccounts } from "@/components/admin/users/social-accounts";
import { UserMetadataCard } from "@/components/admin/users/user-metadata";

export const Profile = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
        </CardHeader>
        <CardContent>
          <PersonalInformation />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Email addresses</CardTitle>
        </CardHeader>
        <CardContent className="px-4 py-2">
          <EmailAddresses />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Social accounts</CardTitle>
        </CardHeader>
        <CardContent className="px-4 py-2">
          <SocialAccounts />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Password</CardTitle>
        </CardHeader>
        <CardContent>
          <Password />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Devices</CardTitle>
        </CardHeader>
        <CardContent className="px-4 py-2">
          <Devices />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Metadata</CardTitle>
        </CardHeader>
        <CardContent>
          <UserMetadataCard />
        </CardContent>
      </Card>
    </div>
  );
};
