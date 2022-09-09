from django.http import JsonResponse
from rest_framework import permissions
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated,IsAdminUser
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from django.contrib.auth.models import User


# from dajngo_react_shop_start.backend.base.models import Category
from .serializers import CategorySerializer, NoteSerializer, ProductSerializer
from base.models import Note,Category,Product,Order,Order_det
from django.contrib.auth import logout

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Add custom claims
        token['username'] = user.username
        token['eeemail'] = user.email
        # ...

        return token

# login
class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer


# @api_view(['GET'])
# def getRoutes(request):
#     routes = [
#         '/api/token',
#         '/api/token/refresh',
#     ]

#     return Response(routes)

# register/signup
@api_view(['POST'])
def register(request):
    User.objects.create_user(username= request.data["username"],email=request.data["email"],password=request.data["password"])
    print( request.data["username"])
    print( request.data["email"])
    print(request.data["password"])
    return Response("routes")


# @api_view(['GET'])
# @permission_classes([IsAuthenticated])
# def getCategories(request):
#     return Response("Categories")


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def myLogout(request):
    logout(request)
    return Response("for yanay with love")


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getNotes(request):
    user = request.user
    notes = user.note_set.all()
    serializer = NoteSerializer(notes, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getOneNote(request):
    user = request.user
    notes = user.note_set.get(id=id)
    serializer = NoteSerializer(notes, many=False)
    return Response(serializer.data)



@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getMyOneNote(request):
    user = request.user
    note = user.note_set.get(id=id)
    res={"body":note.body}
    return Response(res)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def addNote(request):
    serializer = NoteSerializer(data=request.data)

    if( serializer.is_valid()):
        serializer.save(user_id=request.user.id)
    else:
        return Response("data was not saved, error ....")

    return Response("data was create")


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def addCategory(request):
    serializer = CategorySerializer(data=request.data)

    if( serializer.is_valid()):
        serializer.save()#user_id=request.user.id)
    else:
        return Response("data was not saved, error ....")

    return Response("category was create successfully")

@api_view(['POST'])
# @permission_classes([IsAuthenticated])
@permission_classes([IsAdminUser])
def addProduct(request):
    serializer = ProductSerializer(data=request.data)

    if( serializer.is_valid()):
        serializer.save()#user_id=request.user.id)
    else:
        return Response("data was not saved, error ....")

    return Response("product was create successfully")

@api_view(['GET'])
def getCategories(request):
    categories= Category.objects.all()
    serializer = CategorySerializer(categories,many=True)
    return Response(serializer.data)

@api_view(['GET'])
def getProducts(request,id=0):
    if int(id) > 0:
        products= Product.objects.filter(cat_id=int(id))
    else:
        products= Product.objects.all()
    serializer = ProductSerializer(products,many=True)
    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def addOrder(request):
    orders=request.data
    # create a single oreder
    newOrder= Order.objects.create(user_id=request.user,total=1)

    # create new order details
    for x in orders:
        newProd=Product.objects.get(_id= x["_id"])
        total=newProd.price * x["amount"]
        Order_det.objects.create(order_id=newOrder,prod_id=newProd,amount=x["amount"],total=total)

    # print(newOrder)
    # Order_det.objects.create(order_id=newOrder,)
    return Response("product was create successfully")


# class Order_det(models.Model):
#     _id=models.AutoField(primary_key=True,editable=False)
#     order_id =models.ForeignKey(Order, on_delete=models.CASCADE, null=True)
#     prod_id =models.ForeignKey(Product,on_delete=models.SET_NULL,null=True)
#     amount= models.IntegerField()
#     total = models.IntegerField()

    # class Order(models.Model):
    # _id=models.AutoField(primary_key=True,editable=False)
    # user_id = models.ForeignKey(User, on_delete=models.CASCADE, null=True)
    # createdTime=models.DateTimeField(auto_now_add=True)
    # total = models.IntegerField()
    # serializer = ProductSerializer(data=request.data)

    # if( serializer.is_valid()):
    #     serializer.save()#user_id=request.user.id)
    # else:
    #     return Response("data was not saved, error ....")

   