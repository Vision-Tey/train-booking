import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Pencil, Trash2, Loader2, UserCog } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Database } from "@/types/supabase";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];

const UserManagement: React.FC = () => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Form state
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [profileToEdit, setProfileToEdit] = useState<Profile | null>(null);
  const [profileToDelete, setProfileToDelete] = useState<Profile | null>(null);

  // Form fields
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    fetchProfiles();
  }, []);

  const fetchProfiles = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at");

      if (error) throw error;
      setProfiles(data || []);
    } catch (err: any) {
      setError(err.message || "Failed to fetch users");
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFullName("");
    setPhone("");
    setIsAdmin(false);
    setProfileToEdit(null);
    setError(null);
    setSuccess(null);
  };

  const handleEditProfile = async () => {
    if (!profileToEdit) return;

    setIsSubmitting(true);
    setError(null);

    try {
      if (!fullName) {
        throw new Error("Full name is required");
      }

      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: fullName,
          phone: phone || null,
          is_admin: isAdmin,
          updated_at: new Date().toISOString(),
        })
        .eq("id", profileToEdit.id);

      if (error) throw error;

      setSuccess("User updated successfully");
      setIsEditDialogOpen(false);
      resetForm();
      fetchProfiles();
    } catch (err: any) {
      setError(err.message || "Failed to update user");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteProfile = async () => {
    if (!profileToDelete) return;

    setIsSubmitting(true);
    setError(null);

    try {
      // First delete the auth user
      const { error: authError } = await supabase.auth.admin.deleteUser(
        profileToDelete.id,
      );

      if (authError) throw authError;

      // Then delete the profile
      const { error } = await supabase
        .from("profiles")
        .delete()
        .eq("id", profileToDelete.id);

      if (error) throw error;

      setSuccess("User deleted successfully");
      setProfileToDelete(null);
      fetchProfiles();
    } catch (err: any) {
      setError(err.message || "Failed to delete user");
    } finally {
      setIsSubmitting(false);
    }
  };

  const openEditDialog = (profile: Profile) => {
    setProfileToEdit(profile);
    setFullName(profile.full_name || "");
    setPhone(profile.phone || "");
    setIsAdmin(profile.is_admin || false);
    setIsEditDialogOpen(true);
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold">User Management</h2>
          <p className="text-gray-600">Manage user accounts and permissions</p>
        </div>
      </div>

      {success && (
        <div className="bg-green-50 text-green-700 p-3 rounded-md border border-green-200 mb-4">
          {success}
        </div>
      )}

      {error && (
        <div className="bg-red-50 text-red-700 p-3 rounded-md border border-red-200 mb-4">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : profiles.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-300">
          <p className="text-gray-500">No users found.</p>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {profiles.map((profile) => (
              <TableRow key={profile.id}>
                <TableCell>
                  <div className="flex items-center space-x-3">
                    <Avatar>
                      <AvatarImage
                        src={profile.avatar_url || undefined}
                        alt={profile.full_name || "User"}
                      />
                      <AvatarFallback>
                        {profile.full_name?.substring(0, 2).toUpperCase() ||
                          "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">
                        {profile.full_name || "Unnamed User"}
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{profile.phone || "N/A"}</TableCell>
                <TableCell>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${profile.is_admin ? "bg-purple-100 text-purple-800" : "bg-gray-100 text-gray-800"}`}
                  >
                    {profile.is_admin ? "Admin" : "User"}
                  </span>
                </TableCell>
                <TableCell>{formatDate(profile.created_at)}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => openEditDialog(profile)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="icon"
                          className="text-red-500 hover:text-red-700"
                          onClick={() => setProfileToDelete(profile)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete User</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete{" "}
                            {profile.full_name || "this user"}? This action
                            cannot be undone and will remove all user data.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel
                            onClick={() => setProfileToDelete(null)}
                          >
                            Cancel
                          </AlertDialogCancel>
                          <AlertDialogAction
                            onClick={handleDeleteProfile}
                            className="bg-red-500 hover:bg-red-700"
                          >
                            {isSubmitting ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Deleting...
                              </>
                            ) : (
                              "Delete"
                            )}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {/* Edit User Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              Update user details and permissions.
            </DialogDescription>
          </DialogHeader>

          {error && (
            <div className="bg-red-50 text-red-700 p-3 rounded-md border border-red-200 mb-4">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name *</Label>
              <Input
                id="fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="John Doe"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+256 700 000 000"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="isAdmin"
                checked={isAdmin}
                onCheckedChange={setIsAdmin}
              />
              <Label htmlFor="isAdmin" className="cursor-pointer">
                Admin Privileges
              </Label>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleEditProfile} disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update User"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserManagement;
