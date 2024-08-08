/**
 * These types represent response of API calls.
 */

type MessageResponse = {
  message: string;
};

type MyBc = BC & {
  type: BcType;
  user: User;
  bcMembers: (BcMember & { user: User })[];
  totalMembers: number;
};

type MyBcsResponse = MyBc[];
type CreateBcResponse = Omit<MyBc, "totalMembers" | "user">;
type ProfileResponse = User & {
  settings: UserSetting;
};
