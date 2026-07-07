// © 2026 SDGP.lk
// Licensed under the GNU Affero General Public License v3.0 or later,
// with an additional restriction: Non-commercial use only.
// See <https://www.gnu.org/licenses/agpl-3.0.html> for details.

'use client';

import { useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format } from 'date-fns';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useAddUser, useEditUser, useDeleteUser, useFetchUsers, User } from '@/hooks/user';
import { useCurrentUser } from '@/hooks/auth/useCurrentUser';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { ChevronDown, Copy } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useSession } from "next-auth/react";
import { AdminPageShell } from '@/components/layout/admin-page-shell';
import { AdminSearchField } from '@/components/layout/admin-search-field';

// Form validation schema for creating/editing users
// Update userFormSchema to allow empty string in edit mode
const userFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .or(z.literal(""))
    .transform(val => val === "" ? undefined : val),
  role: z.enum(['ADMIN', 'MODERATOR', 'DEVELOPER']),
});

type UserFormValues = z.infer<typeof userFormSchema>;

const roles = ['ADMIN', 'MODERATOR', 'DEVELOPER'] as const;

export default function UserManagement() {
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string | null>(null);
  const [sortColumn, setSortColumn] = useState<string>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [createDialog, setCreateDialog] = useState(false);
  const [editDialog, setEditDialog] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [shareDialog, setShareDialog] = useState(false);
  const [newUserCredentials, setNewUserCredentials] = useState<{ name: string; password: string } | null>(null);
  const [deleteUserDialog, setDeleteUserDialog] = useState(false);
  const [pendingDeleteUserId, setPendingDeleteUserId] = useState<string | null>(null);
  const [bulkDeleteDialog, setBulkDeleteDialog] = useState(false);
  const { data: session } = useSession();

  // Authentication and user role check
  const { isAdmin } = useCurrentUser();

  // Fetch users
  const { users, loading: loadingUsers, error: fetchError, refetch } = useFetchUsers();

  // User operations hooks
  const { addUser, loading: addingUser } = useAddUser();
  const { editUser, loading: editingUser } = useEditUser();
  const { deleteUser, loading: deletingUser } = useDeleteUser();
  const form = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      name: '',
      password: '',
      role: 'MODERATOR',
    },
  });

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };
  const handleCreate = async (data: UserFormValues) => {
    if (!isAdmin) {
      toast.error('Only administrators can create users');
      return;
    }
    // Ensure that a password is provided in create mode
    if (!data.password) {
      toast.error('Password is required');
      return;
    }
    
    const result = await addUser(data as any);
    if (result) {
      setCreateDialog(false);
      // Store credentials for sharing
      setNewUserCredentials({
        name: data.name,
        password: data.password || ''
      });
      setShareDialog(true);
      form.reset();
      refetch();
    }
  };

  const handleEdit = async (data: UserFormValues) => {
    if (!isAdmin || !currentUser) {
      toast.error('Only administrators can edit users');
      return;
    }

    const updateData = {
      id: currentUser.id,
      ...data
    };

    // If password is empty, delete it from the payload
    if (!updateData.password) {
      delete updateData.password;
    }

    const result = await editUser(updateData);
    if (result) {
      setEditDialog(false);
      form.reset();
      refetch(); // Refresh the users list
    }
  };

  const handleDelete = async (userId: string) => {
    if (!isAdmin) {
      toast.error('Only administrators can delete users');
      return;
    }
    const result = await deleteUser(userId);
    if (result) {
      refetch();
    }
  };

  // New function to confirm single deletion from dialog
  const confirmDelete = async () => {
    if (pendingDeleteUserId) {
      await handleDelete(pendingDeleteUserId);
      setPendingDeleteUserId(null);
      setDeleteUserDialog(false);
    }
  };

  // New function to confirm bulk deletion from dialog
  const confirmBulkDelete = async () => {
    let success = true;
    for (const userId of selectedUsers) {
      const result = await deleteUser(userId);
      if (!result) {
        success = false;
      }
    }
    if (success) {
      toast.success('Selected users deleted successfully');
    } else {
      toast.error('Some users could not be deleted');
    }
    setSelectedUsers([]);
    refetch();
    setBulkDeleteDialog(false);
  };

  const handleBulkRoleUpdate = async (role: string) => {
    if (!isAdmin) {
      toast.error('Only administrators can update user roles');
      return;
    }

    let success = true;

    // Update user roles one by one
    for (const userId of selectedUsers) {
      const userData = {
        id: userId,
        role: role as 'ADMIN' | 'MODERATOR' | 'DEVELOPER'
      };

      const result = await editUser(userData);
      if (!result) {
        success = false;
      }
    }

    if (success) {
      toast.success('User roles updated successfully');
    } else {
      toast.error('Some user roles could not be updated');
    }

    setSelectedUsers([]);
    refetch(); // Refresh the users list
  };

  const filteredUsers = users
    .filter(user =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(user => !roleFilter || user.role === roleFilter)
    .sort((a, b) => {
      const aValue = a[sortColumn as keyof User];
      const bValue = b[sortColumn as keyof User];
      return sortDirection === 'asc'
        ? String(aValue).localeCompare(String(bValue))
        : String(bValue).localeCompare(String(aValue));
    });

  const allFilteredSelected =
    filteredUsers.length > 0 &&
    filteredUsers.every((u) => selectedUsers.includes(u.id));

  const toggleUserSelected = useCallback((userId: string) => {
    setSelectedUsers((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
    );
  }, []);

  const toggleSelectAllFiltered = () => {
    if (allFilteredSelected) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(filteredUsers.map((u) => u.id));
    }
  };

  // Function to copy credentials to clipboard
  const copyCredentials = () => {
    if (!newUserCredentials || !session?.user?.name) return;
    
    const message = `Hi ${newUserCredentials.name}!
Your Credentials for SDGP-Connect is as below
username: ${newUserCredentials.name}
password: ${newUserCredentials.password}`;
    
    navigator.clipboard.writeText(message)
      .then(() => {
        toast.success('Credentials copied to clipboard');
      })
      .catch(() => {
        toast.error('Failed to copy credentials');
      });
  };

  return (
    <AdminPageShell
      title="User Management"
      description="Manage user accounts and role assignments."
      actions={
        <Button
          onClick={() => {
            if (!isAdmin) {
              toast.error('Only administrators can create users');
              return;
            }
            setCreateDialog(true);
          }}
          disabled={!isAdmin}
        >
          Create User
        </Button>
      }
    >
      {fetchError ? (
        <div className="admin-content-card border-destructive/40 bg-destructive/5 text-sm text-destructive">
          {fetchError}
        </div>
      ) : null}

      <div className="admin-toolbar">
        <AdminSearchField
          rowClassName="max-w-xl flex-1 justify-start"
          placeholder="Search by name or role…"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          showClear
          onClear={() => setSearchTerm('')}
          aria-label="Search users"
        />
        <div className="admin-toolbar-actions">
          <Select
            value={roleFilter ?? 'all'}
            onValueChange={(v) => setRoleFilter(v === 'all' ? null : v)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All roles</SelectItem>
              {roles.map((role) => (
                <SelectItem key={role} value={role}>
                  {role}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {isAdmin && selectedUsers.length > 0 ? (
        <div className="admin-toolbar border-primary/20 bg-primary/5">
          <p className="text-sm text-muted-foreground">
            <span className="font-medium text-foreground">{selectedUsers.length}</span> selected
          </p>
          <div className="admin-toolbar-actions">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-1">
                  Set role
                  <ChevronDown className="h-4 w-4 opacity-70" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {roles.map((role) => (
                  <DropdownMenuItem key={role} onClick={() => void handleBulkRoleUpdate(role)}>
                    {role}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <Button variant="destructive" size="sm" onClick={() => setBulkDeleteDialog(true)}>
              Delete selected
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setSelectedUsers([])}>
              Clear
            </Button>
          </div>
        </div>
      ) : null}

      <div className="admin-table-wrap">
        <Table>
          <TableHeader className="admin-table-thead">
            <TableRow>
              {isAdmin ? (
                <TableHead className="w-12">
                  <Checkbox
                    checked={allFilteredSelected}
                    onCheckedChange={() => toggleSelectAllFiltered()}
                    aria-label="Select all filtered users"
                  />
                </TableHead>
              ) : null}
              <TableHead className="cursor-pointer" onClick={() => handleSort('name')}>
                Name {sortColumn === 'name' && (sortDirection === 'asc' ? '↑' : '↓')}
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort('role')}>
                Role {sortColumn === 'role' && (sortDirection === 'asc' ? '↑' : '↓')}
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort('createdAt')}>
                Created At {sortColumn === 'createdAt' && (sortDirection === 'asc' ? '↑' : '↓')}
              </TableHead>
              <TableHead className="admin-table-actions-head">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loadingUsers ? (
            <TableRow>
              <TableCell colSpan={isAdmin ? 5 : 4} className="text-center py-10 text-muted-foreground">
                <LoadingSpinner/>
              </TableCell>
            </TableRow>
          ) : filteredUsers.length === 0 ? (
            <TableRow>
              <TableCell colSpan={isAdmin ? 5 : 4} className="p-0">
                <div className="admin-empty-hint border-0">No users match your filters.</div>
              </TableCell>
            </TableRow>
          ) : (
            filteredUsers.map((user) => (
              <TableRow key={user.id} className="transition-colors hover:bg-muted/25">
                {isAdmin ? (
                  <TableCell>
                    <Checkbox
                      checked={selectedUsers.includes(user.id)}
                      onCheckedChange={() => toggleUserSelected(user.id)}
                      aria-label={`Select ${user.name}`}
                    />
                  </TableCell>
                ) : null}
                  <TableCell>{user.name}</TableCell>
                  <TableCell>
                    <Badge variant={
                    user.role === 'ADMIN'
                        ? 'default'
                        : 'secondary'
                  }>
                    {user.role}
                  </Badge>
                </TableCell>
                <TableCell>
                  {format(new Date(user.createdAt), 'd MMM yyyy')}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={!isAdmin}
                      onClick={() => {                        setCurrentUser(user);
                        form.reset({
                          name: user.name,
                          password: '',
                          role: user.role as any,
                        });
                        setEditDialog(true);
                      }}
                    >
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      disabled={!isAdmin}
                      onClick={() => {
                        setPendingDeleteUserId(user.id);
                        setDeleteUserDialog(true);
                      }}
                    >
                      Delete
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
          </TableBody>
        </Table>
      </div>

      {/* Create User Dialog */}
      <Dialog open={createDialog} onOpenChange={setCreateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create User</DialogTitle>
            <DialogDescription>
              Add a new user to the system
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>            <form onSubmit={form.handleSubmit(handleCreate)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {roles.map((role) => (
                          <SelectItem key={role} value={role}>
                            {role}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setCreateDialog(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" >
                  Create User
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={editDialog} onOpenChange={setEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              Modify user details
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleEdit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input {...field} disabled />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password (leave blank to keep current)</FormLabel>
                    <FormControl>
                      <Input type="text" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {roles.map((role) => (
                          <SelectItem key={role} value={role}>
                            {role}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setEditDialog(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" >
                  Save Changes
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Share Credentials Dialog */}
      <Dialog open={shareDialog} onOpenChange={setShareDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Share Credentials</DialogTitle>
            <DialogDescription>
              Hi {session?.user?.name}, copy the below details and share with the user
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center space-x-2">
            <div className="grid flex-1 gap-2">
              <Label htmlFor="credentials" className="sr-only">
                Credentials
              </Label>
              <Textarea
                id="credentials"
                readOnly
                className="h-[100px]"
                value={newUserCredentials ? `Hi ${newUserCredentials.name}!
Your Credentials for SDGP-Connect is
username: ${newUserCredentials.name}
password: ${newUserCredentials.password}` : ''}
              />
            </div>
            <Button type="button" size="sm" className="px-3" onClick={copyCredentials}>
              <span className="sr-only">Copy</span>
              <Copy className="h-4 w-4" />
            </Button>
          </div>
          <DialogFooter className="sm:justify-start">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setShareDialog(false)}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Single Delete Confirmation Dialog */}
      <Dialog open={deleteUserDialog} onOpenChange={setDeleteUserDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this user?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setDeleteUserDialog(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={confirmDelete}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Bulk Delete Confirmation Dialog */}
      <Dialog open={bulkDeleteDialog} onOpenChange={setBulkDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Bulk Delete</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete selected users?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setBulkDeleteDialog(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={confirmBulkDelete}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminPageShell>
  );
}