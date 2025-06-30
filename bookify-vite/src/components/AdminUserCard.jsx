import Buttonn from './Button';

const AdminUserCard = ({ user, onDelete }) => {
  return (
    <div className="bg-[rgba(var(--bookcard),1)] border rounded shadow p-4 relative transition hover:bg-[rgba(var(--card),1)] cursor-default">
      <p className="font-semibold text-[rgba(var(--copy-primary),1)] mb-1">
        {user.first_name} {user.last_name}
      </p>
      <p className="text-sm text-[rgba(var(--copy-primary),1)]">ID: {user.user_id}</p>
      <p className="text-sm text-gray-500">Dept: {user.Department}</p>
      <p className="text-sm text-gray-500">Position: {user.Position}</p>

      <Buttonn
        label="Delete"
        variant="trash"
        onClick={() => {
          if (window.confirm(`Are you sure you want to delete ${user.first_name} ${user.last_name}?`)) {
            onDelete?.(user);
          }
        }}
        className="absolute top-2 right-2"
      />
    </div>
  );
};

export default AdminUserCard;
