from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import exception_handler

class ResponseHandler:
    @staticmethod
    def success_response(data=None, code=1, message='', extras=None):
        response = {
            'data': data,
            'meta': {
                'code': code,
                'message': message
            }
        }
        if extras:
            response['meta'].update(extras)
        return Response(response)

    @staticmethod
    def error_response(message, code=0, data=None):
        response = {
            'data': data,
            'meta': {
                'code': code,
                'message': message
            }
        }
        
        return Response(status=status.HTTP_400_BAD_REQUEST, data=response)
    

def custom_exception_handler(exc, context):
    response = exception_handler(exc, context)
    print("FIRSE RESPONSE: ,", response)

    if response is not None:
        print("EXEC: ", exec)

        if hasattr(exc, 'detail'):
            print("EXEC: ", exec)
            if isinstance(exc.detail, list):
                message = ', '.join([str(m) for m in exc.detail])
            else:
                message = str(exc.detail)
        else:
            message = str(exc)

        response.data = {
            'data': None,
            'meta': {
                'code': 0,
                'message': message
            }
        }
        print("RESPONSE: ", response)

    return response