import Button from './Button';

const AdminUserCard = ({ user, onDelete }) => {
  return (
    <div className="bg-white border rounded shadow p-4 relative transition hover:bg-gray-50 cursor-default">
      <p className="font-semibold text-gray-800 mb-1">
        {user.first_name} {user.last_name}
      </p>
      <p className="text-sm text-gray-500">ID: {user.user_id}</p>
      <p className="text-sm text-gray-500">Dept: {user.Department}</p>
      <p className="text-sm text-gray-500">Position: {user.Position}</p>

      <Button
        label="Delete"
        variant="danger"
        size="sm"
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
