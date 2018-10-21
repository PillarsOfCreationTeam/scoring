#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import cgi, sys, os, base64, pickle
from skimage import color
import skimage.io as io
import skimage.transform as tf

print("Content-Type: text/html\n\n")

# directory to save image masks
img_dir = 'masks'
if not os.path.exists(img_dir):
    os.makedirs(img_dir)

# get base64-encoded image and name
try:
    form = cgi.FieldStorage()
    img_name = form.getvalue('name')
    img_data = base64.b64decode(form.getvalue('img').replace(' ', '+'))
except:
    sys.exit(0)

# set paths
msk_path = os.path.join(img_dir, img_name + '.png')
new_path = os.path.join(img_dir, img_name + '_new.png')
prv_path = os.path.join(img_dir, img_name + '_last.png')
pkl_path = os.path.join(img_dir, img_name + '_last.pkl')

# read as grayscale image
open(new_path, 'wb').write(img_data)
new = color.rgb2gray(io.imread(new_path))
os.unlink(new_path)

# save as a mask the first time
if not os.path.isfile(msk_path):
    n = 1
    msk = new
    message = "You're the first to explore this object!"
# compare with the existing mask
else:
    n = pickle.load(open(pkl_path, 'rb')) + 1
    # read mask and last submission, resize the new one
    msk = color.rgb2gray(color.gray2rgb(io.imread(msk_path)))
    prv = color.rgb2gray(color.gray2rgb(io.imread(prv_path)))
    new = tf.resize(new, msk.shape)
    # compute the MSE
    nval = ((msk + new) != 0).sum()
    x = ((msk - new)**2).sum() / nval
    # set the result
    if x < 0.5:
        message = "Well done!"
    elif x < 0.7:
        message = "Almost there!"
    else:
        message = "You can do better..."
    # update the mask with a simple moving average
    msk = msk + new / n - prv / n

# save state & return the result
io.imsave(msk_path, msk)
io.imsave(prv_path, new)
pickle.dump(n, open(pkl_path, 'wb'))

print('<h1>%s</h1>' % (message,))
