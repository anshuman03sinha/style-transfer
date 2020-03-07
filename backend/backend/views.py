from django.shortcuts import render
import json
import base64
import binascii
# from .models import DoctorDetails,PatientDetails,Records,Chat
# from .serializers import DoctorDetailsSerializer,PatientDetailsSerializer,RecordsSerializer,ChatSerializer
from rest_framework import generics
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from datetime import date
from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
#imports from ml style transfer
import os
import time
import numpy as np
import tensorflow as tf
from collections import defaultdict
from style_transfer import Transfer
import utils as utils
import scipy.misc
import cv2
from PIL import Image
class getStyleImage(APIView):

    # def get(self, request, format=None):
    #     customer = CustomerDetails.objects.all()
    #     # serializer = CustomerDetailsSerializer(customer, many=True)
    #     return Response(serializer.data)

    def post(self, request, format=None):
        # tf.reset_default_graph()
        print("dadt")
        json_data = json.loads(request.body)
        style_image = json_data['style_image']
        content_image = json_data['content_image']
        checkpoint_path_str = 'checkpoints/'+style_image
        print(style_image)
        print(checkpoint_path_str)
        # content_image = base64.decodestring(content_image)
        # content_image = base64_bytes.decode('ascii')
        # <<< encoded = 'YmFzZTY0IGVuY29kZWQgc3RyaW5n'
        # r = base64.decodebytes(content_image)
        
        imgdata = base64.b64decode(content_image)
        filename = 'img.jpg'  # I assume you have a way of picking unique filenames
        with open(filename, 'wb') as f:
            f.write(imgdata)
        # q = np.frombuffer(r, dtype=np.float64)
        # content_image = base64.b64decode(content_image)

        # print(style_image)
        # print(content_image)
        checkpoint_path = str(checkpoint_path_str)
        os.environ['CUDA_VISIBLE_DEVICES'] = '0'
        in_image = './img.jpg'
        out_path='./img2.jpg'
        im = cv2.imread("./img.jpg")
       
        # print(type(im))
        # print(im)
        style_image = feed_transform(im,out_path,checkpoint_path)
        utils.imsave(out_path, style_image)
        with open("img2.jpg", "rb") as img_file:
            my_string = base64.b64encode(img_file.read())
        my_string = str(my_string)
        print(type(my_string))
        data = {
            'style_image' : my_string
        }
        response = json.dumps(data)
        # print(response)
        return Response(response, status=status.HTTP_201_CREATED)
        if len(obj)>0:
            return Response(status=status.HTTP_201_CREATED)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@csrf_exempt 
def index(request):
    print("manan")
    checkpoint_path = 'checkpoints/la_muse'
    os.environ['CUDA_VISIBLE_DEVICES'] = '0'
    in_image = './img.png'
    
    # out_image = feed_transform(in_path,out_path,checkpoint_path)


    
def feed_transform(style_image, paths_out, checkpoint_dir):
    img_shape = style_image.shape
    print("manan")
    print(img_shape)
    g = tf.Graph()
   
    soft_config = tf.ConfigProto(allow_soft_placement=True)
    soft_config.gpu_options.allow_growth = True

    with g.as_default(), tf.Session(config=soft_config) as sess:
        img_placeholder = tf.placeholder(tf.float32, shape=[None, *img_shape], name='img_placeholder')

        model = Transfer()
        pred = model(img_placeholder)

        saver = tf.train.Saver()
        if os.path.isdir(checkpoint_dir):
            ckpt = tf.train.get_checkpoint_state(checkpoint_dir)
            if ckpt and ckpt.model_checkpoint_path:
                saver.restore(sess, ckpt.model_checkpoint_path)
            else:
                raise Exception('No checkpoint found...')
        else:
            saver.restore(sess, checkpoint_dir)

        img = np.asarray([style_image]).astype(np.float32)
        start_tic = time.time()
        _pred = sess.run(pred, feed_dict={img_placeholder: img})
        end_toc = time.time()
        print('PT: {:.2f} msec.\n'.format((end_toc - start_tic) * 1000))
        img = np.clip(_pred[0], 0, 255).astype(np.uint8)
        return img
        # utils.imsave(paths_out, _pred[0])  # paths_out and _pred is list

