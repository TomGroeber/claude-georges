from rest_framework.permissions import BasePermission

class IsSiteAdmin(BasePermission):
    """
    Allows access only to admin users.
    """

    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False
        return request.user.role == "admin"