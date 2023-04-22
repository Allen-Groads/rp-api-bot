export enum Role {
    Admin = 'Owner',
    Moderator = 'Moderator',
    Team = 'RP-Api',
    User = 'Guest',
  }
  
  export const rolePermissions = new Map<Role, string[]>([
    [Role.Admin, ['ping', 'checkrole']],
    [Role.Moderator, ['ping', 'checkrole']],
    [Role.Team, ['ping', 'checkrole']],
    [Role.User, ['ping']],
  ]);
  