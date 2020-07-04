export class RoleDonVi {
  public roleDonViId: number;
  public roleId: string;
  public donViId: number;
  public roleName: string;

  constructor(roleDonViId?: number, roleId?: string, donViId?: number, roleName?: string) {
    this.roleDonViId = roleDonViId;
    this.roleId = roleId;
    this.donViId = donViId;
    this.roleName = roleName;
  }
}
