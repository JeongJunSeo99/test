import os
import sys
from datetime import datetime
import matplotlib as mpl
import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
if __name__ == '__main__':
    os.environ['TF_CPP_MIN_LOG_LEVEL'] = '2'
    cur = sys.argv[1:]
    cur_list = list(cur)
    df = pd.DataFrame(cur_list)
#    df['time']= (df['time'] - np.datetime64('1970-01-01T00:00:00Z')) / np.timedelta64(1, 's')
 #   df['time'] = df['time'].values.astype('int64')
    df.to_csv("test.csv")
