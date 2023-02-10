var store = [{
        "title": "First Post",
        "excerpt":"First post here. More to come later. Happy X-mas to you all!  ","categories": [],
        "tags": [],
        "url": "https://kadler.io/2016/12/23/first-post.html",
        "teaser":null},{
        "title": "PATH vs LIBPATH",
        "excerpt":"I see this kind of tip suggested a lot when dealing with PASE issues: export PATH=/my/path/bin:/other/path/bin:$PATH export LIBPATH=/my/path/bin:/other/path/bin:$LIBPATH This misguided suggestion bugs me to no end, so today I’m here to educate and clear up confusion over LIBPATH. We’re on the Road PATH to Nowhere Let’s start by looking at...","categories": ["libpath","pase"],
        "tags": [],
        "url": "https://kadler.io/2017/09/01/path.html",
        "teaser":null},{
        "title": "LIBPATH... How Does It Work?",
        "excerpt":"So in the last entry, I described the differences between PATH and LIBPATH, but I didn’t really explain how LIBPATH is actually used. I’m going to rectify that in this entry. First, though, we need to take a detour and learn how programs get loaded. Loading 101 When you execute...","categories": ["libpath","pase"],
        "tags": [],
        "url": "https://kadler.io/2017/09/08/libpath.html",
        "teaser":null},{
        "title": "Mucking with the Runtime Library Search Path on PASE",
        "excerpt":"In my last blog I showed how the LIBPATH gets used and also how the runtime search path in the binary gets used. LIBPATH is obviously set as an environment variable, but how does that runtime search path get generated? Let’s explore! #include &lt;stdio.h&gt; int main(int argc, char** argv) {...","categories": ["libpath","pase"],
        "tags": [],
        "url": "https://kadler.io/2017/11/17/how-to-libpath.html",
        "teaser":null},{
        "title": "Fetching Python Database Cursors by Column Name",
        "excerpt":"Today I got asked if you can index in to rows returned by ibm_db_dbi by column name. While this doesn’t come out of the box1, it can be done pretty easily. Here’s some bog-standard Python code that executes a query and prints out each row: import ibm_db_dbi as db2 cur...","categories": ["python","ibm_db"],
        "tags": [],
        "url": "https://kadler.io/2018/01/08/fetching-python-database-cursors-by-column-name.html",
        "teaser":null},{
        "title": "Calling QSH utilities from PASE",
        "excerpt":"QSH provides a wonderful utility called db2 which allows you to run SQL queries from within the QSH shell, but what if you’re in a QP2TERM shell or using SSH - what then? QSH from PASE Well, PASE provides a qsh utility which allows you to call programs within the...","categories": ["pase","qsh"],
        "tags": [],
        "url": "https://kadler.io/2018/05/29/calling-qsh-utilities-from-pase.html",
        "teaser":null},{
        "title": "Using Python ibm_db with Un-journaled Tables",
        "excerpt":"When using the Python ibm_db package to interact with the Db2 for i database, you may run in to this error: &gt;&gt;&gt; cur.execute('insert into qtemp.foo values(1)') Traceback (most recent call last): File \"/QOpenSys/pkgs/lib/python3.6/site-packages/ibm_db_dbi.py\", line 1311, in _execute_helper return_value = ibm_db.execute(self.stmt_handler) Exception: Statement Execute Failed: FOO in QTEMP not valid for...","categories": ["python","ibm_db"],
        "tags": [],
        "url": "https://kadler.io/2018/09/20/using-python-ibm-db-with-un-journaled-files.html",
        "teaser":null},{
        "title": "Using System Naming in Python ibm_db",
        "excerpt":"Like last-week’s post about commitment control in Python ibm_db, you may run in to this unexpected error as well: &gt;&gt;&gt; cur.callproc('qcmdexc', ('ADDLIBLE QIWS',)) ('ADDLIBLE QIWS',) &gt;&gt;&gt; cur.execute(\"select * from qcustcdt\") Traceback (most recent call last): File \"/QOpenSys/pkgs/lib/python3.6/site-packages/ibm_db_dbi.py\", line 1254, in _prepare_helper self.stmt_handler = ibm_db.prepare(self.conn_handler, operation) Exception: QCUSTCDT in KADLER type...","categories": ["python","ibm_db"],
        "tags": [],
        "url": "https://kadler.io/2018/09/28/using-system-naming-in-ibm_db.html",
        "teaser":null},{
        "title": "Bash Command Oddities",
        "excerpt":"Sometimes when using bash, you can run in to an oddity where it keeps running the “wrong” command. Let’s go through a scenario: It was a dark and stormy night… You want to install a Python package and you’re using the new Python 3.6 installed via yum: bash-4.4$ export PATH=/QOpenSys/pkgs/bin:$PATH...","categories": ["bash"],
        "tags": [],
        "url": "https://kadler.io/2018/10/02/bash-command-oddities.html",
        "teaser":null},{
        "title": "IBM i Open Source Updates Dec 2019",
        "excerpt":"It’s a new year and so I’m finally getting around to doing something that I’ve wanted to do for a while now: write a blog series about various updates about what the IBM i OSS team is doing. I’m not sure the cadence of these updates, but I’ll try to...","categories": ["ibmi-oss-updates"],
        "tags": [],
        "url": "https://kadler.io/2020/01/08/oss-updates.html",
        "teaser":null},{
        "title": "IBM i Open Source Updates Jan 2020",
        "excerpt":"Well, I hadn’t planned to take this long to get out another blog, but the world of OSS moves fast and things have been very busy around here. I’m planning on having more frequent updates than every other month. Let’s start with what my team did in January. Package Updates...","categories": ["ibmi-oss-updates"],
        "tags": [],
        "url": "https://kadler.io/2020/04/10/oss-updates.html",
        "teaser":null},{
        "title": "IBM i Open Source Updates Feb 2020",
        "excerpt":"Wow, hasn’t even been a week! In this blog entry, I’m going to go over what my team delivered in February. New Packages jq jq is described as “sed for JSON”. If you don’t know what sed is, it stands for Stream EDitor and basically it allows you to slice...","categories": ["ibmi-oss-updates"],
        "tags": [],
        "url": "https://kadler.io/2020/04/15/feb-oss-updates.html",
        "teaser":null},{
        "title": "IBM i Open Source Updates Mar 2020",
        "excerpt":"Alright folks, strap in because March was a busy month! New Packages tmux tmux is a Terminal MUltipleXer. It allows you to create multiple sessions that are persistent - you can disconnect (or become disconnected, eg. wifi drops off) and then reconnect and everything will be as it was before....","categories": ["ibmi-oss-updates"],
        "tags": [],
        "url": "https://kadler.io/2020/04/22/mar-oss-updates.html",
        "teaser":null},{
        "title": "IBM i Open Source Updates Apr 2020",
        "excerpt":"April seemed very busy to me, but it ended up being rather mild in what we actually delivered. I suspect that means that my May update will be a rather large update. :wink: NOTE: I said last time I was going to update on the other things my team was...","categories": ["ibmi-oss-updates"],
        "tags": [],
        "url": "https://kadler.io/2020/05/20/apr-oss-updates.html",
        "teaser":null},{
        "title": "IBM i Open Source Updates May 2020",
        "excerpt":"Well, I mentioned before that the May update was gonna be big and boy is it a doozy! New Packages logrotate logrotate is a tool that can rotate your logs — you can configure it to automatically rotate, compress, and even remove your log files. This is very useful for...","categories": ["ibmi-oss-updates"],
        "tags": [],
        "url": "https://kadler.io/2020/06/22/may-oss-updates.html",
        "teaser":null},{
        "title": "IBM i Open Source Updates June 2020",
        "excerpt":"Well, it’s that time of the month again. Time to talk about all the OSS updates that’s fit to print! New Packages OpenJ9 + OpenJDK Java 11 Definitely the biggest new package of June (possibly of the year) is the Early Access release of Java 11 for IBM i via...","categories": ["ibmi-oss-updates"],
        "tags": [],
        "url": "https://kadler.io/2020/07/15/jun-oss-updates.html",
        "teaser":null},{
        "title": "IBM i Open Source Updates July 2020",
        "excerpt":"Been a while so let’s get right to it. New Packages Node.js 14 While Node.js 14 was released back in April we managed to get legal approval in July to ship it. Initially version 14.4, but later we updated it to 14.5 and 14.6. Note that although Node 15 was...","categories": ["ibmi-oss-updates"],
        "tags": [],
        "url": "https://kadler.io/2020/10/23/jul-oss-updates.html",
        "teaser":null},{
        "title": "IBM i Open Source Updates August & September 2020",
        "excerpt":"While August had some big hitters, September was very quiet so I decided to only do one update. New Packages Ghostscript Ghostscript is a PostScript and PDF interpreter. It is primarily used to generate PDFs from various input formats. Note that Ghostscript is licensed under the Affero GNU Public Licence...","categories": ["ibmi-oss-updates"],
        "tags": [],
        "url": "https://kadler.io/2020/10/28/aug-oss-updates.html",
        "teaser":null},{
        "title": "IBM i Open Source Updates October & November 2020",
        "excerpt":"October was a pretty slow month with mostly low-level improvements so I figured I’d combine them with the November updates. November turned out to be a pretty big, so here we go! New Packages PCRE2 PCRE stands for Perl Compatible Regular Expressions, and is a regular expression library. While we...","categories": ["ibmi-oss-updates"],
        "tags": [],
        "url": "https://kadler.io/2020/12/02/nov-oss-updates.html",
        "teaser":null},{
        "title": "getjobid, cl, and liblist — Oh, My!",
        "excerpt":"With the latest update to BASH, there are 3 new IBM i-specific BASH builtin functions: liblist, cl, and getjobid. These builtins function nearly identically to the liblist, system, and getjobid commands that exist in PASE and/or QSH. If these commands already exist, why add them to BASH? Let’s explore: $...","categories": ["ibmi-oss-updates"],
        "tags": [],
        "url": "https://kadler.io/2020/12/23/bash-builtins.html",
        "teaser":null},{
        "title": "IBM i Open Source Updates December 2020",
        "excerpt":"Being the holiday and end of year season here in Rochester, things are wrapping up for the year so I figured I’d put out my December update now instead of next month. Consider it an early Xmas present - just watch out for Santa’s bicycle gun! :wink: New Packages cronie...","categories": ["ibmi-oss-updates"],
        "tags": [],
        "url": "https://kadler.io/2020/12/23/dec-oss-updates.html",
        "teaser":null},{
        "title": "IBM i Open Source Updates February 2021",
        "excerpt":"New year, new rpm updates! In this post, we’ll go over updates for both January and February. New Packages No new packages. Package Updates util-linux Previously, we only shipped the libuuid subset of this package, but now we have enabled various other utilities: cal It’s a known fact that date...","categories": ["ibmi-oss-updates"],
        "tags": [],
        "url": "https://kadler.io/2021/03/03/feb-oss-updates.html",
        "teaser":null},{
        "title": "IBM i Open Source Updates March 2021",
        "excerpt":"Hold on to your hats, because this might be the biggest monthly update yet! New Packages Integer Set Library (ISL) ISL is a math library used by GCC and needed to build GCC. This will likely be more useful in the future. :wink: GCC Package and gcc-aix Our existing gcc-related...","categories": ["ibmi-oss-updates"],
        "tags": [],
        "url": "https://kadler.io/2021/04/07/mar-oss-updates.html",
        "teaser":null},{
        "title": "IBM i Open Source Updates April 2021",
        "excerpt":"Well, I’m a month late, but let’s not dawdle any further – on to the updates! New Packages Node.js 16 Node.js 16 was released in April and we have had it since day 2 (missed day 1 by a few hours unfortunately, but gotta leave some room for improvement :wink:)....","categories": ["ibmi-oss-updates"],
        "tags": [],
        "url": "https://kadler.io/2021/06/04/apr-oss-updates.html",
        "teaser":null},{
        "title": "IBM i Open Source Updates May 2021",
        "excerpt":"May updates at the same time as April updates? Madness, I say! New Packages HarfBuzz HarfBuzz is a text shaping library with quite a unique name. I mentioned in April’s update that Pango used Harfbuzz for complex text shaping. Well, apparently in our haste to ship Pango we forgot to...","categories": ["ibmi-oss-updates"],
        "tags": [],
        "url": "https://kadler.io/2021/06/04/may-oss-updates.html",
        "teaser":null},{
        "title": "IBM-provided Repositories and YUM Updates",
        "excerpt":"Today, we’re pushing out an update to YUM which will automatically pull in a new ibmi-repos package. The ibmi-repos package will provide two “new” repositories: ibmi-base ibmi-release The new ibmi-base repo will point to the same place that the current ibm repo does, while the ibmi-release repo will point at...","categories": ["ibmi-oss-updates"],
        "tags": [],
        "url": "https://kadler.io/2021/12/07/ibmi-repos.html",
        "teaser":null},{
        "title": "IBM i Open Source Updates June 2021",
        "excerpt":"Hey, it’s been a while! I got way behind on pushing out update blogs, so I’ll be pushing out updates to catch up on the 2021 and try to be more consistent for 2022. New Packages python-rpm-macros This package contains improved rpm macros for Python. The rpm-devel package already ships...","categories": ["ibmi-oss-updates"],
        "tags": [],
        "url": "https://kadler.io/2022/01/04/jun-2021-oss-updates.html",
        "teaser":null},{
        "title": "IBM i Open Source Updates July 2021",
        "excerpt":"Back with another overdue update, this time for July. Big news this month, which had been hinted at for a while. Did you figure it out ahead of time? New Packages Python 3.9 In addition to the existing Python 2.7 and 3.6, you can now use Python 3.9 on IBM...","categories": ["ibmi-oss-updates"],
        "tags": [],
        "url": "https://kadler.io/2022/01/07/july-2021-oss-updates.html",
        "teaser":null},{
        "title": "IBM i Open Source Updates August 2021",
        "excerpt":"August is up, let’s check it out. New Packages Ncdu Ncdu stands for “NCurses Disk Usage” and is a curses-based equivalent to the standard du Unix command and TUI equivalent to tools like WinDirStat or QDirStat. Not only can you visualize the hierarchical storage usage, but you can also clean...","categories": ["ibmi-oss-updates"],
        "tags": [],
        "url": "https://kadler.io/2022/01/10/aug-2021-oss-updates.html",
        "teaser":null},{
        "title": "IBM i Open Source Updates September 2021",
        "excerpt":"September was a pretty quiet month, but still some good stuff. New Packages Service Commander Service Commander is tool for starting and managing services on IBM i. It makes it easy to manage your open source PASE services as well as traditional ILE services and jobs. Some examples: Start the...","categories": ["ibmi-oss-updates"],
        "tags": [],
        "url": "https://kadler.io/2022/01/14/sep-2021-oss-updates.html",
        "teaser":null},{
        "title": "IBM i Open Source Updates October 2021",
        "excerpt":"Another relatively quiet month of IBM i open source updates. Package Updates python39-pyzmq pyzmq was previously packaged for Python 3.6 and now packaged for Python 3.9, along with being updated to version 22.1.0. Other Updates nodejs12 was updated to 12.22.7 nodejs14 was updated to 14.18.1 nodejs16 was updated to 16.11.1...","categories": ["ibmi-oss-updates"],
        "tags": [],
        "url": "https://kadler.io/2022/01/17/oct-2021-oss-updates.html",
        "teaser":null},{
        "title": "IBM i Open Source Updates November 2021",
        "excerpt":"November brings some nice goodies for IBM i 7.3+ users and some security fixes. New Packages ibmi-repos I previously talked about this package here. Leptonica Leptonica is a set of image processing and analysis libraries. It supports numerous operations: Raster operations Affine transforms (scaling, translation, rotation, shear) on images of...","categories": ["ibmi-oss-updates"],
        "tags": [],
        "url": "https://kadler.io/2022/01/24/nov-2021-oss-updates.html",
        "teaser":null},{
        "title": "IBM i Open Source Updates December 2021",
        "excerpt":"Just because the last couple months were quiet doesn’t mean that nothing’s going on. Case in point, the last month of 2021 saw a ton of updates, though many of them had been in the works for a long time. Package Updates yum Yum now requires the ibmi-repos package. This...","categories": ["ibmi-oss-updates"],
        "tags": [],
        "url": "https://kadler.io/2022/01/31/dec-2021-oss-updates.html",
        "teaser":null},{
        "title": "IBM i Open Source Updates January 2022",
        "excerpt":"Happy new year! I know it’s late February now, but it’s still the first post of 2022 here, so let’s see what January had to offer. :grin: New Packages GNU binutils GNU binutils is a collection of binary tools, mainly the GNU linker (ld) and the GNU assembler (as). Many...","categories": ["ibmi-oss-updates"],
        "tags": [],
        "url": "https://kadler.io/2022/02/21/jan-2022-oss-updates.html",
        "teaser":null},{
        "title": "IBM-provided Repositories ODBC Linux Driver Repositories",
        "excerpt":"Today, we’re pushing out something that I’ve been wanting for a long time. We now have RPM and DEB repositories for Linux available directly from IBM for the IBM i Access Client Solutions application package, which includes the IBM i Access ODBC driver. This also includes the latest version of...","categories": ["odbc"],
        "tags": [],
        "url": "https://kadler.io/2022/05/20/odbc-repos.html",
        "teaser":null}]
