from PIL import Image
import os
from os import path
from os.path import join

absPath = path.dirname(path.realpath(__file__))


def isOnlyWhiteImage(rgb_list_img:list) -> bool:
    for rgb in rgb_list_img:
        if rgb != 255:
            return False
    return True

def make_rgb_list_from_image(img_name):
    '''convert rgba value which is like => (number,number,number,number) into just => number
     and return all numbers as list'''
    im = Image.open(img_name)
    im.thumbnail((21,21))
    im.save(img_name)
    pixel_values = list(im.getdata())
    rgb_list_img = []

    # convert rgba value which is like => (number,number,number,number) into just => number
    for rgb in pixel_values:
        val = rgb if type(rgb) == int else rgb[0]
        rgb_list_img.append(val)
    if isOnlyWhiteImage(rgb_list_img):
        rgb_list_img = []
        return rgb_list_img

    return rgb_list_img

def defference(list1,list2):
    '''return the deference from every rgb cell between the two image lists of rgb values'''
    sum_ = 0
    for i in range(len(list1)):
        sum_ += abs(list1[i] - list2[i])
    return sum_

def detectTestImageWithDataImages(img,listOfImages):
    '''make the defference between the test image and all data images and take the avg of it'''
    avg_sum = 0
    avg_ = []
    for image in listOfImages:
        avg_.append(defference(img,image))
        avg_sum += defference(img,image)
    print(avg_sum/len(listOfImages))
    return (avg_sum/len(listOfImages))
    # return min(avg_)

def StartDetect(testImage):
    test1 = make_rgb_list_from_image(join(absPath,'images/test/',testImage))
    if test1 == []:
        return "white"

    listOfSmileImages = []
    # counter = 0
    for image in os.listdir(join(absPath,"images/data/smile_images")):
        li = make_rgb_list_from_image(join(absPath,"images/data/smile_images/",image))
        listOfSmileImages.append(li)
    #     counter += 1
    # print(counter)
    # counter = 0
    listOfSadImages = []
    for image in os.listdir(join(absPath,"images/data/sad_images")):
        li = make_rgb_list_from_image(join(absPath,"images/data/sad_images/",image))
        listOfSadImages.append(li)
    #     counter += 1
    # print(counter)
    val1 = detectTestImageWithDataImages(test1,listOfSmileImages)
    val2 = detectTestImageWithDataImages(test1,listOfSadImages)

    if(val1 < val2):
        return "happy"
    if(val1 > val2):
        return "sad"



















