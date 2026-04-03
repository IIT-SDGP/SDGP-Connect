// © 2026 SDGP.lk
// Licensed under the GNU Affero General Public License v3.0 or later,
// with an additional restriction: Non-commercial use only.
// See <https://www.gnu.org/licenses/agpl-3.0.html> for details.

'use client';

import { useState } from 'react';
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
import { useEditUser, useDeleteUser, useFetchUsers, User } from '@/hooks/user';
import { useCurrentUser } from '@/hooks/auth/useCurrentUser';
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
import { Badge } from '@/components/ui/badge';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { useToast } from '@/hooks/contact/use-toast';

type Role = 'ADMIN' | 'MODERATOR' | 'DEVELOPER' | 'STUDENT';

const ALL_ROLES: Role[] = ['ADMIN', 'MODERATOR', 'DEVELOPER', 'STUDENT'];

const userFormSchema = z.object({
  role: z.enum(['ADMIN', 'MODERATOR', 'DEVELOPER', 'STUDENT']),
});

type UserFormValues = z.infer<typeof userFormSchema>;

const roleBadgeVariant = (role: string): 'default' | 'secondary' | 'outline' | 'destructive' => {
  switch (role) {
    case 'ADMIN':
      return 'default';
    case 'MODERATOR':
      return 'destructive';
    case 'DEVELOPER':
      return 'outline';
    default:
      return 'secondary';
  }
};

export default function UserManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<Role | null>(null);
  const [sortColumn, setSortColumn] = useState<string>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [editDialog, setEditDialog] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [deleteUserDialog, setDeleteUserDialog] = useState(false);
  const [pendingDeleteUserId, setPendingDeleteUserId] = useState<string | null>(null);

  const { isAdmin } = useCurrentUser();
  const { toast } = useToast();

  const { users, loading: loadingUsers, refetch } = useFetchUsers();
  const { editUser } = useEditUser();
  const { deleteUser } = useDeleteUser();

  const form = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      role: 'STUDENT',
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

  const handleEdit = async (data: UserFormValues) => {
    if (!isAdmin || !currentUser) return;

    const result = await editUser({ id: currentUser.id, ...data });

    if (result) {
      toast({
        title: 'User updated',
        description: `${currentUser.name}'s role has been changed to ${data.role}.`,
      });
      setEditDialog(false);
      form.reset();
      refetch();
    } else {
      toast({
        title: 'Update failed',
        description: 'Could not update the user. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const confirmDelete = async () => {
    if (!pendingDeleteUserId) return;

    const result = await deleteUser(pendingDeleteUserId);

    if (result) {
      toast({
        title: 'User deleted',
        description: 'The user has been removed successfully.',
      });
      refetch();
    } else {
      toast({
        title: 'Delete failed',
        description: 'Could not delete the user. Please try again.',
        variant: 'destructive',
      });
    }

    setPendingDeleteUserId(null);
    setDeleteUserDialog(false);
  };

  const filteredUsers = users
    .filter(
      (user) =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.role.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((user) => !roleFilter || user.role === roleFilter)
    .sort((a, b) => {
      const aValue = a[sortColumn as keyof User];
      const bValue = b[sortColumn as keyof User];
      return sortDirection === 'asc'
        ? String(aValue).localeCompare(String(bValue))
        : String(bValue).localeCompare(String(aValue));
    });

  const roleCounts = ALL_ROLES.reduce<Record<string, number>>((acc, role) => {
    acc[role] = users.filter((u) => u.role === role).length;
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">User Management</h1>
        <p className="text-muted-foreground">Manage user accounts and roles</p>
      </div>

      {/* Role Filter Tabs */}
      <div className="flex gap-2 flex-wrap">
        <Button
          variant={roleFilter === null ? 'default' : 'outline'}
          size="sm"
          onClick={() => setRoleFilter(null)}
        >
          All
          <span className="ml-2 rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
            {users.length}
          </span>
        </Button>
        {ALL_ROLES.map((role) => (
          <Button
            key={role}
            variant={roleFilter === role ? 'default' : 'outline'}
            size="sm"
            onClick={() => setRoleFilter(role)}
          >
            {role}
            <span className="ml-2 rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
              {roleCounts[role] ?? 0}
            </span>
          </Button>
        ))}
      </div>

      {/* Search */}
      <Input
        placeholder="Search by name or role..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="max-w-sm"
      />

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="cursor-pointer" onClick={() => handleSort('name')}>
                Name {sortColumn === 'name' && (sortDirection === 'asc' ? '↑' : '↓')}
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort('role')}>
                Role {sortColumn === 'role' && (sortDirection === 'asc' ? '↑' : '↓')}
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort('createdAt')}>
                Created At {sortColumn === 'createdAt' && (sortDirection === 'asc' ? '↑' : '↓')}
              </TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loadingUsers ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-4">
                  <LoadingSpinner />
                </TableCell>
              </TableRow>
            ) : filteredUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-4">
                  No users found
                </TableCell>
              </TableRow>
            ) : (
              filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>
                    <Badge variant={roleBadgeVariant(user.role)}>{user.role}</Badge>
                  </TableCell>
                  <TableCell>{format(new Date(user.createdAt), 'd MMM yyyy')}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={!isAdmin}
                        onClick={() => {
                          setCurrentUser(user);
                          form.reset({ role: user.role as Role });
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

      {/* Edit User Dialog */}
      <Dialog open={editDialog} onOpenChange={setEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>Change the role for {currentUser?.name}</DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleEdit)} className="space-y-4">
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {ALL_ROLES.map((role) => (
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
                  onClick={() => {
                    setEditDialog(false);
                    form.reset();
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting ? <LoadingSpinner /> : 'Save Changes'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteUserDialog} onOpenChange={setDeleteUserDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this user? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setDeleteUserDialog(false)}>
              Cancel
            </Button>
            <Button type="button" variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}