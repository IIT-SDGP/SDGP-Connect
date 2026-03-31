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
import { useAddUser, useEditUser, useDeleteUser, useFetchUsers, User } from '@/hooks/user';
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
import { toast } from 'sonner';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Copy } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useSession } from 'next-auth/react';

type Role = 'ADMIN' | 'MODERATOR' | 'DEVELOPER' | 'STUDENT';

const ALL_ROLES: Role[] = ['ADMIN', 'MODERATOR', 'DEVELOPER', 'STUDENT'];

const userFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .or(z.literal(''))
    .transform((val) => (val === '' ? undefined : val)),
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
  const [createDialog, setCreateDialog] = useState(false);
  const [editDialog, setEditDialog] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [shareDialog, setShareDialog] = useState(false);
  const [newUserCredentials, setNewUserCredentials] = useState<{ name: string; password: string } | null>(null);
  const [deleteUserDialog, setDeleteUserDialog] = useState(false);
  const [pendingDeleteUserId, setPendingDeleteUserId] = useState<string | null>(null);

  const { data: session } = useSession();
  const { isAdmin } = useCurrentUser();

  const { users, loading: loadingUsers, refetch } = useFetchUsers();
  const { addUser } = useAddUser();
  const { editUser } = useEditUser();
  const { deleteUser } = useDeleteUser();

  const form = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      name: '',
      password: '',
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

  const handleCreate = async (data: UserFormValues) => {
    if (!isAdmin) {
      toast.error('Only administrators can create users');
      return;
    }
    if (!data.password) {
      toast.error('Password is required');
      return;
    }
    const result = await addUser(data as any);
    if (result) {
      setCreateDialog(false);
      setNewUserCredentials({ name: data.name, password: data.password || '' });
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
    const updateData: any = { id: currentUser.id, ...data };
    if (!updateData.password) delete updateData.password;
    const result = await editUser(updateData);
    if (result) {
      setEditDialog(false);
      form.reset();
      refetch();
    }
  };

  const confirmDelete = async () => {
    if (pendingDeleteUserId) {
      const result = await deleteUser(pendingDeleteUserId);
      if (result) refetch();
      setPendingDeleteUserId(null);
      setDeleteUserDialog(false);
    }
  };

  const copyCredentials = () => {
    if (!newUserCredentials) return;
    const message = `Hi ${newUserCredentials.name}!\nYour Credentials for SDGP-Connect is as below\nusername: ${newUserCredentials.name}\npassword: ${newUserCredentials.password}`;
    navigator.clipboard.writeText(message)
      .then(() => toast.success('Credentials copied to clipboard'))
      .catch(() => toast.error('Failed to copy credentials'));
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
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">User Management</h1>
          <p className="text-muted-foreground">Manage user accounts and roles</p>
        </div>
        <Button
          onClick={() => {
            if (!isAdmin) {
              toast.error('Only administrators can create users');
              return;
            }
            form.reset({ name: '', password: '', role: 'STUDENT' });
            setCreateDialog(true);
          }}
          disabled={!isAdmin}
        >
          Create User
        </Button>
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
                          form.reset({ name: user.name, password: '', role: user.role as any });
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
            <DialogDescription>Add a new user to the system</DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleCreate)} className="space-y-4">
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
                <Button type="button" variant="outline" onClick={() => setCreateDialog(false)}>
                  Cancel
                </Button>
                <Button type="submit">Create User</Button>
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
            <DialogDescription>Modify user details</DialogDescription>
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
                <Button type="button" variant="outline" onClick={() => setEditDialog(false)}>
                  Cancel
                </Button>
                <Button type="submit">Save Changes</Button>
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
                value={
                  newUserCredentials
                    ? `Hi ${newUserCredentials.name}!\nYour Credentials for SDGP-Connect is\nusername: ${newUserCredentials.name}\npassword: ${newUserCredentials.password}`
                    : ''
                }
              />
            </div>
            <Button type="button" size="sm" className="px-3" onClick={copyCredentials}>
              <span className="sr-only">Copy</span>
              <Copy className="h-4 w-4" />
            </Button>
          </div>
          <DialogFooter className="sm:justify-start">
            <Button type="button" variant="secondary" onClick={() => setShareDialog(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteUserDialog} onOpenChange={setDeleteUserDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
            <DialogDescription>Are you sure you want to delete this user?</DialogDescription>
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